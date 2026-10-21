import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { isFirebaseConfigured, getDbFirestore } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit as firestoreLimit,
} from "firebase/firestore";

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: "unread" | "contacted" | "qualified" | "won" | "archived" | string;
  score: number;
  score_tier: "hot" | "warm" | "cold";
  score_reasons_json: string;
  phone?: string;
  admin_notes?: string;
}

export interface EstimateRecord {
  id: string;
  project_type: string;
  total_hours: number;
  estimated_days: number;
  modules_json: string;
  custom_features_json: string;
  raw_specification?: string;
  created_at: string;
  status: string;
}

export interface AdminStats {
  engine: "firebase" | "sqlite";
  totalContacts: number;
  unreadContacts: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  wonLeads: number;
  totalEstimates: number;
  totalEstimatedHours: number;
  projectTypeBreakdown: Record<string, number>;
}

// ==========================================
// Local SQLite Instance Handler (Fallback)
// ==========================================
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;
  const dataDir = isVercel ? "/tmp" : path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "nexus.db");
  const db = new Database(dbPath);

  try {
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  } catch (pragmaErr) {
    console.warn("Notice setting pragma:", pragmaErr);
  }

  // 1. Base tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT DEFAULT 'unread'
    );

    CREATE TABLE IF NOT EXISTS estimates (
      id TEXT PRIMARY KEY,
      project_type TEXT NOT NULL,
      total_hours INTEGER NOT NULL,
      estimated_days INTEGER NOT NULL,
      modules_json TEXT NOT NULL,
      custom_features_json TEXT NOT NULL,
      raw_specification TEXT,
      created_at TEXT NOT NULL,
      status TEXT DEFAULT 'active'
    );
  `);

  // 2. Safe Auto-Migration
  try {
    const tableInfo = db.pragma("table_info(contacts)") as Array<{ name: string }>;
    const existingCols = new Set(tableInfo.map((c) => c.name));

    if (!existingCols.has("score")) db.exec("ALTER TABLE contacts ADD COLUMN score INTEGER DEFAULT 0;");
    if (!existingCols.has("score_tier")) db.exec("ALTER TABLE contacts ADD COLUMN score_tier TEXT DEFAULT 'cold';");
    if (!existingCols.has("score_reasons_json")) db.exec("ALTER TABLE contacts ADD COLUMN score_reasons_json TEXT DEFAULT '[]';");
    if (!existingCols.has("phone")) db.exec("ALTER TABLE contacts ADD COLUMN phone TEXT DEFAULT '';");
    if (!existingCols.has("admin_notes")) db.exec("ALTER TABLE contacts ADD COLUMN admin_notes TEXT DEFAULT '';");
  } catch (migErr) {
    console.warn("Schema migration notice:", migErr);
  }

  // 3. Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_contacts_score_tier ON contacts(score_tier);
    CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
    CREATE INDEX IF NOT EXISTS idx_estimates_created_at ON estimates(created_at DESC);
  `);

  dbInstance = db;
  return dbInstance;
}

export function getDbEngineType(): "firebase" | "sqlite" {
  return isFirebaseConfigured() ? "firebase" : "sqlite";
}

// ==========================================
// Contact Operations (Async Hybrid)
// ==========================================

export async function saveContact(data: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  score?: number;
  score_tier?: "hot" | "warm" | "cold";
  score_reasons_json?: string;
}): Promise<ContactRecord> {
  const id = `contact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();
  const score = data.score ?? 0;
  const scoreTier = data.score_tier ?? "cold";
  const reasonsJson = data.score_reasons_json ?? "[]";
  const phone = data.phone ?? "";

  const record: ContactRecord = {
    id,
    name: data.name,
    email: data.email,
    message: data.message,
    created_at: createdAt,
    status: "unread",
    score,
    score_tier: scoreTier,
    score_reasons_json: reasonsJson,
    phone,
    admin_notes: "",
  };

  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const docRef = doc(firestore, "contacts", id);
        await setDoc(docRef, record);
        return record;
      } catch (err) {
        console.warn("Firestore save notice, falling back to SQLite:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO contacts (id, name, email, message, created_at, status, score, score_tier, score_reasons_json, phone, admin_notes)
    VALUES (?, ?, ?, ?, ?, 'unread', ?, ?, ?, ?, '')
  `);
  stmt.run(id, data.name, data.email, data.message, createdAt, score, scoreTier, reasonsJson, phone);

  return record;
}

export async function getContacts(limitCount = 100): Promise<ContactRecord[]> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const q = query(
          collection(firestore, "contacts"),
          orderBy("created_at", "desc"),
          firestoreLimit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => d.data() as ContactRecord);
      } catch (err) {
        console.error("Firebase getContacts error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, name, email, message, created_at, status, score, score_tier, score_reasons_json, phone, admin_notes
    FROM contacts
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(limitCount) as ContactRecord[];
}

export async function getFilteredContacts(filter?: {
  status?: string;
  tier?: string;
  query?: string;
  limit?: number;
}): Promise<ContactRecord[]> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const q = query(
          collection(firestore, "contacts"),
          orderBy("created_at", "desc"),
          firestoreLimit(filter?.limit || 100)
        );
        const snapshot = await getDocs(q);
        let list = snapshot.docs.map((d) => d.data() as ContactRecord);

        // Apply filters in memory
        if (filter?.status && filter.status !== "all") {
          list = list.filter((c) => c.status === filter.status);
        }
        if (filter?.tier && filter.tier !== "all") {
          list = list.filter((c) => c.score_tier === filter.tier);
        }
        if (filter?.query && filter.query.trim()) {
          const needle = filter.query.toLowerCase().trim();
          list = list.filter(
            (c) =>
              c.name.toLowerCase().includes(needle) ||
              c.email.toLowerCase().includes(needle) ||
              c.message.toLowerCase().includes(needle) ||
              (c.phone && c.phone.includes(needle))
          );
        }
        return list;
      } catch (err) {
        console.error("Firebase getFilteredContacts error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filter?.status && filter.status !== "all") {
    conditions.push("status = ?");
    params.push(filter.status);
  }

  if (filter?.tier && filter.tier !== "all") {
    conditions.push("score_tier = ?");
    params.push(filter.tier);
  }

  if (filter?.query && filter.query.trim()) {
    conditions.push("(name LIKE ? OR email LIKE ? OR message LIKE ? OR phone LIKE ?)");
    const q = `%${filter.query.trim()}%`;
    params.push(q, q, q, q);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const lim = filter?.limit || 100;
  params.push(lim);

  const stmt = db.prepare(`
    SELECT id, name, email, message, created_at, status, score, score_tier, score_reasons_json, phone, admin_notes
    FROM contacts
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ?
  `);

  return stmt.all(...params) as ContactRecord[];
}

export async function updateContactStatus(id: string, status: string, notes?: string): Promise<boolean> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const docRef = doc(firestore, "contacts", id);
        const payload: Record<string, unknown> = { status };
        if (notes !== undefined) payload.admin_notes = notes;
        await updateDoc(docRef, payload);
        return true;
      } catch (err) {
        console.error("Firebase updateContactStatus error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  if (notes !== undefined) {
    const stmt = db.prepare(`UPDATE contacts SET status = ?, admin_notes = ? WHERE id = ?`);
    const res = stmt.run(status, notes, id);
    return res.changes > 0;
  } else {
    const stmt = db.prepare(`UPDATE contacts SET status = ? WHERE id = ?`);
    const res = stmt.run(status, id);
    return res.changes > 0;
  }
}

export async function updateContactNotes(id: string, notes: string): Promise<boolean> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const docRef = doc(firestore, "contacts", id);
        await updateDoc(docRef, { admin_notes: notes });
        return true;
      } catch (err) {
        console.error("Firebase updateContactNotes error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`UPDATE contacts SET admin_notes = ? WHERE id = ?`);
  const res = stmt.run(notes, id);
  return res.changes > 0;
}

export async function deleteContact(id: string): Promise<boolean> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const docRef = doc(firestore, "contacts", id);
        await deleteDoc(docRef);
        return true;
      } catch (err) {
        console.error("Firebase deleteContact error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`DELETE FROM contacts WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}

// ==========================================
// Estimate Operations (Async Hybrid)
// ==========================================

export interface SaveEstimateInput {
  project_type: string;
  total_hours: number;
  estimated_days: number;
  modules: Record<string, boolean | unknown>;
  custom_features: Array<{ id: string; name: string; estimatedHours: number }>;
  raw_specification?: unknown;
}

export async function saveEstimate(data: SaveEstimateInput): Promise<EstimateRecord> {
  const id = `est_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();
  const modulesJson = JSON.stringify(data.modules || {});
  const customFeaturesJson = JSON.stringify(data.custom_features || []);
  const rawSpec = data.raw_specification ? JSON.stringify(data.raw_specification) : null;

  const record: EstimateRecord = {
    id,
    project_type: data.project_type,
    total_hours: data.total_hours,
    estimated_days: data.estimated_days,
    modules_json: modulesJson,
    custom_features_json: customFeaturesJson,
    raw_specification: rawSpec || undefined,
    created_at: createdAt,
    status: "active",
  };

  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const docRef = doc(firestore, "estimates", id);
        await setDoc(docRef, record);
        return record;
      } catch (err) {
        console.error("Firebase saveEstimate error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO estimates (
      id, project_type, total_hours, estimated_days,
      modules_json, custom_features_json, raw_specification, created_at, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `);
  stmt.run(id, data.project_type, data.total_hours, data.estimated_days, modulesJson, customFeaturesJson, rawSpec, createdAt);

  return record;
}

export async function getEstimates(limitCount = 50): Promise<EstimateRecord[]> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const q = query(
          collection(firestore, "estimates"),
          orderBy("created_at", "desc"),
          firestoreLimit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => d.data() as EstimateRecord);
      } catch (err) {
        console.error("Firebase getEstimates error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, project_type, total_hours, estimated_days,
           modules_json, custom_features_json, raw_specification, created_at, status
    FROM estimates
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(limitCount) as EstimateRecord[];
}

export async function getLatestEstimate(): Promise<EstimateRecord | null> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const q = query(
          collection(firestore, "estimates"),
          orderBy("created_at", "desc"),
          firestoreLimit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs[0].data() as EstimateRecord;
        }
      } catch (err) {
        console.error("Firebase getLatestEstimate error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, project_type, total_hours, estimated_days,
           modules_json, custom_features_json, raw_specification, created_at, status
    FROM estimates
    ORDER BY created_at DESC
    LIMIT 1
  `);
  const row = stmt.get();
  return (row as EstimateRecord) || null;
}

export async function deleteEstimate(id: string): Promise<boolean> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const docRef = doc(firestore, "estimates", id);
        await deleteDoc(docRef);
        return true;
      } catch (err) {
        console.error("Firebase deleteEstimate error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();
  const stmt = db.prepare(`DELETE FROM estimates WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}

// ==========================================
// Admin Analytics & Aggregates
// ==========================================

export async function getAdminStats(): Promise<AdminStats> {
  // Option A: Firebase Cloud Firestore
  if (isFirebaseConfigured()) {
    const firestore = getDbFirestore();
    if (firestore) {
      try {
        const contactsSnap = await getDocs(collection(firestore, "contacts"));
        const contacts = contactsSnap.docs.map((d) => d.data() as ContactRecord);

        const estimatesSnap = await getDocs(collection(firestore, "estimates"));
        const estimates = estimatesSnap.docs.map((d) => d.data() as EstimateRecord);

        let unread = 0;
        let hot = 0;
        let warm = 0;
        let cold = 0;
        let won = 0;

        for (const c of contacts) {
          if (c.status === "unread") unread++;
          if (c.status === "won") won++;
          if (c.score_tier === "hot" || c.score >= 70) hot++;
          else if (c.score_tier === "warm" || c.score >= 40) warm++;
          else cold++;
        }

        let totalHours = 0;
        const projectTypeBreakdown: Record<string, number> = {};
        for (const e of estimates) {
          totalHours += e.total_hours || 0;
          projectTypeBreakdown[e.project_type] = (projectTypeBreakdown[e.project_type] || 0) + 1;
        }

        return {
          engine: "firebase",
          totalContacts: contacts.length,
          unreadContacts: unread,
          hotLeads: hot,
          warmLeads: warm,
          coldLeads: cold,
          wonLeads: won,
          totalEstimates: estimates.length,
          totalEstimatedHours: totalHours,
          projectTypeBreakdown,
        };
      } catch (err) {
        console.error("Firebase getAdminStats error:", err);
      }
    }
  }

  // Option B: Local SQLite fallback
  const db = getDb();

  const totalContactsRow = db.prepare("SELECT COUNT(*) as count FROM contacts").get() as { count: number };
  const unreadRow = db.prepare("SELECT COUNT(*) as count FROM contacts WHERE status = 'unread'").get() as { count: number };
  const hotRow = db.prepare("SELECT COUNT(*) as count FROM contacts WHERE score_tier = 'hot'").get() as { count: number };
  const warmRow = db.prepare("SELECT COUNT(*) as count FROM contacts WHERE score_tier = 'warm'").get() as { count: number };
  const coldRow = db.prepare("SELECT COUNT(*) as count FROM contacts WHERE score_tier = 'cold'").get() as { count: number };
  const wonRow = db.prepare("SELECT COUNT(*) as count FROM contacts WHERE status = 'won'").get() as { count: number };

  const totalEstimatesRow = db.prepare("SELECT COUNT(*) as count, COALESCE(SUM(total_hours), 0) as hours FROM estimates").get() as {
    count: number;
    hours: number;
  };

  const projectTypeRows = db.prepare(`
    SELECT project_type, COUNT(*) as count
    FROM estimates
    GROUP BY project_type
  `).all() as Array<{ project_type: string; count: number }>;

  const projectTypeBreakdown: Record<string, number> = {};
  for (const row of projectTypeRows) {
    projectTypeBreakdown[row.project_type] = row.count;
  }

  return {
    engine: "sqlite",
    totalContacts: totalContactsRow?.count || 0,
    unreadContacts: unreadRow?.count || 0,
    hotLeads: hotRow?.count || 0,
    warmLeads: warmRow?.count || 0,
    coldLeads: coldRow?.count || 0,
    wonLeads: wonRow?.count || 0,
    totalEstimates: totalEstimatesRow?.count || 0,
    totalEstimatedHours: totalEstimatesRow?.hours || 0,
    projectTypeBreakdown,
  };
}
