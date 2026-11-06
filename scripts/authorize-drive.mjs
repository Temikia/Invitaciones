import { createServer } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const REDIRECT_URI = "http://127.0.0.1:8788/oauth2callback";
const EXPECTED_EMAIL = "temikia.agency@gmail.com";
const EXPECTED_FOLDER_ID = "1nRdKntaJdXVdH_FvbLijCxCA3g_zbohM";
const SCOPES = ["https://www.googleapis.com/auth/drive.file", "openid", "email"];
const LOCAL_ORIGIN = "http://127.0.0.1:8788";

try {
  process.loadEnvFile(".env");
} catch {
  // The diagnostic below explains missing local configuration without printing it.
}

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_PICKER_API_KEY } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_SECRET || !GOOGLE_PICKER_API_KEY) {
  console.error("Falta configurar GOOGLE_CLIENT_ID, GOOGLE_SECRET o GOOGLE_PICKER_API_KEY en .env. No se muestran valores.");
  process.exit(1);
}

const state = randomBytes(32).toString("base64url");
let pendingRefreshToken = null;
let pendingAccessToken = null;
const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", LOCAL_ORIGIN);
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "GET" && url.pathname === "/oauth2callback") {
    const actualState = url.searchParams.get("state") ?? "";
    const supplied = Buffer.from(actualState);
    const expected = Buffer.from(state);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" }).end("OAuth state inválido. Cierra esta página y vuelve a iniciar el flujo.");
      return;
    }
    const code = url.searchParams.get("code");
    if (!code) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" }).end("Google no devolvió autorización.");
      return;
    }
    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      });
      const token = await tokenResponse.json();
      if (!tokenResponse.ok || !token.access_token || !token.refresh_token) {
        throw new Error("No se recibió autorización sin conexión. Revisa el usuario de prueba y vuelve a consentir la app.");
      }
      const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      const user = await userResponse.json();
      if (!userResponse.ok || user.email?.toLowerCase() !== EXPECTED_EMAIL || user.email_verified !== true) {
        throw new Error(`Autoriza con la cuenta propietaria ${EXPECTED_EMAIL}.`);
      }
      pendingRefreshToken = token.refresh_token;
      pendingAccessToken = token.access_token;

      const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Autorizar carpeta de recuerdos</title><style>body{font:16px system-ui;max-width:42rem;margin:12vh auto;padding:0 1.25rem;background:#160d23;color:#f7f1e8}button{background:#d5b66b;border:0;padding:.8rem 1.1rem;border-radius:.5rem;font:inherit}p{line-height:1.6}.status{color:#e8cf8f}</style><h1>Autoriza la carpeta de recuerdos</h1><p>En el selector, elige la carpeta <strong>Mis-XV-Camila</strong>. La aplicación solicita acceso solo a los archivos que selecciones.</p><button id="choose">Seleccionar carpeta</button><p class="status" id="status" role="status"></p><script src="https://apis.google.com/js/api.js"></script><script>const token=${JSON.stringify(token.access_token)};const apiKey=${JSON.stringify(GOOGLE_PICKER_API_KEY)};const expected=${JSON.stringify(EXPECTED_FOLDER_ID)};const statusEl=document.getElementById('status');function failed(message){statusEl.textContent=message}function pickerReady(){const view=new google.picker.DocsView(google.picker.ViewId.FOLDERS).setIncludeFolders(true).setSelectFolderEnabled(true);const picker=new google.picker.PickerBuilder().setDeveloperKey(apiKey).setOAuthToken(token).setAppId(${JSON.stringify(GOOGLE_CLIENT_ID.split("-")[0])}).addView(view).setCallback(async(data)=>{if(data.action!==google.picker.Action.PICKED)return;const item=data.docs?.[0];if(!item||item.id!==expected){failed('La carpeta elegida no coincide con Mis-XV-Camila.');return}const result=await fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({folderId:item.id})});const body=await result.json();statusEl.textContent=body.message||'No se pudo guardar la autorización.'}).build();picker.setVisible(true)}document.getElementById('choose').addEventListener('click',()=>{gapi.load('picker',pickerReady)})</script></html>`;
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline' https://apis.google.com; connect-src 'self' https://apis.google.com https://*.googleapis.com https://*.google.com; frame-src https://drive.google.com https://docs.google.com https://accounts.google.com; style-src 'unsafe-inline'; img-src data: https://*.googleusercontent.com https://*.gstatic.com",
      }).end(html);
    } catch (error) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" }).end(error instanceof Error ? error.message : "Falló la autorización.");
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/save") {
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      const { folderId } = JSON.parse(body);
      if (folderId !== EXPECTED_FOLDER_ID || typeof pendingRefreshToken !== "string" || !pendingRefreshToken) throw new Error("La carpeta elegida no coincide o falta el token.");
      const folderResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(folderId)}?supportsAllDrives=true&fields=id,name,mimeType,driveId,capabilities(canDeleteChildren)`, {
        headers: { Authorization: `Bearer ${pendingAccessToken}` },
      });
      const folder = await folderResponse.json();
      if (!folderResponse.ok || folder.id !== EXPECTED_FOLDER_ID || folder.name !== "Mis-XV-Camila" || folder.mimeType !== "application/vnd.google-apps.folder") {
        throw new Error("No se pudo verificar la carpeta Mis-XV-Camila con la cuenta autorizada.");
      }
      const location = folder.driveId ? "unidad compartida" : "Mi unidad";
      if (folder.driveId && folder.capabilities?.canDeleteChildren !== true) {
        throw new Error("La carpeta está en una unidad compartida, pero la cuenta no puede borrar archivos. Necesita el rol de organizadora.");
      }
      const envText = await readFile(".env", "utf8");
      const setEnv = (source, key, value) => {
        const line = `${key}=${value}`;
        const pattern = new RegExp(`^${key}=.*$`, "m");
        return pattern.test(source) ? source.replace(pattern, line) : `${source.trimEnd()}\n${line}\n`;
      };
      let updated = setEnv(envText, "GOOGLE_REFRESH_TOKEN", pendingRefreshToken);
      updated = setEnv(updated, "DRIVE_FOLDER_ID", folderId);
      await writeFile(".env", updated, { encoding: "utf8", mode: 0o600 });
      pendingRefreshToken = null;
      pendingAccessToken = null;
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" }).end(JSON.stringify({ message: `Carpeta comprobada en ${location}. Token guardado en .env local sin mostrarlo. No lo compartas ni lo subas a Git.` }));
      console.log("Autorización guardada localmente; los secretos no se muestran.");
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" }).end(JSON.stringify({ message: error instanceof Error ? error.message : "No se pudo guardar la autorización." }));
    }
    return;
  }
  res.writeHead(404).end();
});

server.listen(8788, "127.0.0.1", () => {
  const authorization = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorization.search = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  }).toString();
  console.log(`1. Registra en el cliente OAuth el URI: ${REDIRECT_URI}`);
  console.log("2. Abre este enlace e inicia sesión con la cuenta propietaria:");
  console.log(authorization.toString());
  console.log("3. En el selector, elige Mis-XV-Camila. El token se guarda en .env sin imprimirse.");
  console.log("El servidor local permanecerá activo hasta cerrar esta ventana con Ctrl+C.");
});
