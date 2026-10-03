/* Accès au Google Sheet de suivi, via un compte de service.
   Si les variables d'environnement ne sont pas renseignées, toutes les
   écritures sont ignorées silencieusement : l'application continue de
   fonctionner, seul l'archivage distant est désactivé. */

import crypto from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export const ONGLET_UTILISATEURS = "Utilisateurs";
export const ONGLET_JOURNAL = "Journal";

interface CompteService {
  client_email: string;
  private_key: string;
}

/**
 * Même convention que le CRM : le compte de service arrive encodé en base64
 * dans GOOGLE_SERVICE_ACCOUNT_BASE64, ce qui évite les problèmes
 * d'échappement des retours à la ligne de la clé privée dans un champ texte
 * de dashboard. Le couple email + clé reste accepté en secours.
 */
function compteService(): CompteService | null {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    try {
      const json = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8");
      const c = JSON.parse(json) as CompteService;
      if (c.client_email && c.private_key) return c;
    } catch {
      return null;
    }
  }
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }
  return null;
}

export function sheetsConfigure(): boolean {
  return Boolean(process.env.GOOGLE_SHEET_ID) && compteService() !== null;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

let cache: { token: string; expire: number } | null = null;

async function jeton(): Promise<string> {
  if (cache && Date.now() < cache.expire - 60_000) return cache.token;

  const compte = compteService();
  if (!compte) throw new Error("Compte de service Google absent de l'environnement.");
  const email = compte.client_email;
  const cle = compte.private_key;

  const maintenant = Math.floor(Date.now() / 1000);
  const entete = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const corps = base64url(
    JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: maintenant, exp: maintenant + 3600 })
  );

  const signature = base64url(crypto.createSign("RSA-SHA256").update(`${entete}.${corps}`).sign(cle));
  const assertion = `${entete}.${corps}.${signature}`;

  const reponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });

  if (!reponse.ok) {
    throw new Error(`Jeton Google refusé (${reponse.status}) : ${await reponse.text()}`);
  }
  const data = (await reponse.json()) as { access_token: string; expires_in: number };
  cache = { token: data.access_token, expire: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function appel(chemin: string, init?: RequestInit): Promise<Response> {
  const id = process.env.GOOGLE_SHEET_ID!;
  const reponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}${chemin}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${await jeton()}`, "Content-Type": "application/json" },
  });
  if (!reponse.ok) {
    throw new Error(`Google Sheets (${reponse.status}) : ${await reponse.text()}`);
  }
  return reponse;
}

export async function lire(plage: string): Promise<string[][]> {
  const r = await appel(`/values/${encodeURIComponent(plage)}`);
  const data = (await r.json()) as { values?: string[][] };
  return data.values ?? [];
}

export async function ajouterLigne(onglet: string, valeurs: (string | number)[]): Promise<void> {
  await appel(`/values/${encodeURIComponent(onglet)}!A1:append?valueInputOption=USER_ENTERED`, {
    method: "POST",
    body: JSON.stringify({ values: [valeurs] }),
  });
}

export async function ecrireLigne(onglet: string, ligne: number, valeurs: (string | number)[]): Promise<void> {
  const fin = String.fromCharCode(64 + Math.min(valeurs.length, 26));
  await appel(`/values/${encodeURIComponent(`${onglet}!A${ligne}:${fin}${ligne}`)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    body: JSON.stringify({ values: [valeurs] }),
  });
}

/** Crée les deux onglets et leurs en-têtes s'ils n'existent pas déjà. */
export async function initialiser(entetesUtilisateurs: string[]): Promise<void> {
  const r = await appel("");
  const meta = (await r.json()) as { sheets: { properties: { title: string } }[] };
  const existants = meta.sheets.map((s) => s.properties.title);

  const aCreer = [ONGLET_UTILISATEURS, ONGLET_JOURNAL].filter((t) => !existants.includes(t));
  if (aCreer.length) {
    await appel(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: aCreer.map((title) => ({ addSheet: { properties: { title } } })),
      }),
    });
  }

  if (!(await lire(`${ONGLET_UTILISATEURS}!A1:A1`)).length) {
    await ajouterLigne(ONGLET_UTILISATEURS, entetesUtilisateurs);
  }
  if (!(await lire(`${ONGLET_JOURNAL}!A1:A1`)).length) {
    await ajouterLigne(ONGLET_JOURNAL, [
      "Horodatage",
      "Clé",
      "Prénom",
      "Nom",
      "Saisie brute",
      "Événement",
      "Page",
      "Progression %",
    ]);
  }
}
