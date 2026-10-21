import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "nexus2026";
const COOKIE_NAME = "nexus_admin_session";

function getExpectedToken(): string {
  return crypto.createHmac("sha256", "nexus-salt-secure").update(ADMIN_SECRET).digest("hex");
}

export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionCookie) return false;
  return sessionCookie === getExpectedToken();
}

export function generateAdminSessionToken(inputSecret: string): string | null {
  if (inputSecret.trim() === ADMIN_SECRET.trim()) {
    return getExpectedToken();
  }
  return null;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
