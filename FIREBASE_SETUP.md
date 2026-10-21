# 🔥 Guía Rápida de Configuración de Firebase (Cloud Firestore)

Con Firebase Firestore, todos los prospectos y cotizaciones que envíen tus clientes en **Vercel** quedarán guardados permanentemente en la nube de Google de forma 100% gratuita.

---

### Paso 1: Crear el proyecto en Firebase (1 minuto)
1. Entra a [console.firebase.google.com](https://console.firebase.google.com/) con tu cuenta de Google.
2. Haz clic en **"Agregar proyecto"** (o *"Crear proyecto"*).
3. Dale un nombre (ejemplo: `nexusweb-technologies`) y haz clic en Continuar.
4. Desactiva Google Analytics si quieres que se cree en 5 segundos y haz clic en **"Crear proyecto"**.

---

### Paso 2: Activar Cloud Firestore
1. En el menú lateral izquierdo, haz clic en **Compilación (Build)** &rarr; **Firestore Database**.
2. Haz clic en el botón **"Crear base de datos"**.
3. Selecciona una ubicación (ej. `nam5 (us-central)` o la más cercana a tus clientes).
4. En la pestaña de Reglas de seguridad, selecciona **"Comenzar en modo de prueba"** (o pega las reglas que te dejamos abajo) y haz clic en **Crear**.

#### Reglas de Firestore Recomendadas:
En la pestaña **Reglas** de Firestore, puedes colocar:
```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

### Paso 3: Obtener tus Claves de Firebase
1. En la parte superior izquierda, haz clic en el engranaje ⚙️ &rarr; **Configuración del proyecto**.
2. Desplázate hacia abajo hasta la sección **"Tus apps"** y haz clic en el ícono Web **`</>`**.
3. Escribe un apodo (ej. `nexusweb`) y haz clic en **Registrar app**.
4. Verás un bloque de código como este:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyB...",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

---

### Paso 4: Conectar con Vercel
En tu panel de [vercel.com](https://vercel.com) &rarr; Tu Proyecto &rarr; **Settings** &rarr; **Environment Variables**, agrega:

| Variable | Valor |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Tu `apiKey` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Tu `authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Tu `projectId` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Tu `storageBucket` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Tu `messagingSenderId` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Tu `appId` |

*(O si prefieres, simplemente crea una sola variable llamada `FIREBASE_CONFIG` y pega todo el JSON entre comillas).*

---

### Paso 5: Conectar en Local (opcional)
Crea un archivo llamado `.env.local` en la carpeta raíz del proyecto y pega las mismas variables.

> 💡 **Nota:** Si no configuras las variables en local, el sistema funcionará automáticamente con **SQLite (`data/nexus.db`)** como respaldo offline.
