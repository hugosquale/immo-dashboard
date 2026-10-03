/* Authentification admin par mot de passe unique, stocké en variable
   d'environnement (jamais dans le code source). Le jeton de session est
   signé (HMAC) et sans état : aucune base de données de sessions, il reste
   valable tant que son horodatage n'est pas expiré et que la signature
   correspond — ce qui survit aussi un redémarrage du serveur. */

import crypto from "node:crypto";

export const COOKIE_NOM = "squale_admin";
const DUREE_MS = 8 * 60 * 60 * 1000; // 8 heures

function secret(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

export function adminConfigure(): boolean {
  return Boolean(secret());
}

/** Compare deux chaînes en temps constant, via leur empreinte SHA-256. */
function egalesEnTempsConstant(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function motDePasseValide(saisi: string): boolean {
  const s = secret();
  if (!s) return false;
  return egalesEnTempsConstant(saisi, s);
}

function signer(message: string): string {
  return crypto.createHmac("sha256", secret() ?? "").update(message).digest("hex");
}

export function genererJeton(): string {
  const expire = Date.now() + DUREE_MS;
  return `${expire}.${signer(String(expire))}`;
}

export function jetonValide(jeton: string | undefined | null): boolean {
  if (!jeton || !secret()) return false;
  const [expireStr, signature] = jeton.split(".");
  if (!expireStr || !signature) return false;
  const expire = Number(expireStr);
  if (!Number.isFinite(expire) || Date.now() > expire) return false;
  const attendu = signer(expireStr);
  return (
    attendu.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(attendu), Buffer.from(signature))
  );
}

/* Limite les tentatives de mot de passe : 5 essais, puis 60 secondes
   d'attente, par adresse IP. Mémoire locale au processus — un redémarrage
   remet le compteur à zéro, ce qui est un compromis acceptable ici. */
const tentatives = new Map<string, { nb: number; depuis: number; bloqueJusqua: number }>();
const FENETRE_MS = 60_000;
const MAX_ESSAIS = 5;

export function limiteAtteinte(ip: string): boolean {
  const e = tentatives.get(ip);
  return Boolean(e && Date.now() < e.bloqueJusqua);
}

export function enregistrerEchec(ip: string): void {
  const maintenant = Date.now();
  const e = tentatives.get(ip);
  if (!e || maintenant - e.depuis > FENETRE_MS) {
    tentatives.set(ip, { nb: 1, depuis: maintenant, bloqueJusqua: 0 });
    return;
  }
  e.nb += 1;
  if (e.nb >= MAX_ESSAIS) e.bloqueJusqua = maintenant + FENETRE_MS;
}

export function reinitialiserEchecs(ip: string): void {
  tentatives.delete(ip);
}
