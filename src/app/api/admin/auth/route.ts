import { NextResponse } from "next/server";
import {
  COOKIE_NOM,
  adminConfigure,
  motDePasseValide,
  genererJeton,
  limiteAtteinte,
  enregistrerEchec,
  reinitialiserEchecs,
} from "@/lib/adminAuth";

function adresseIp(request: Request): string {
  const transmise = request.headers.get("x-forwarded-for");
  return transmise?.split(",")[0]?.trim() || "inconnue";
}

export async function POST(request: Request) {
  if (!adminConfigure()) {
    return NextResponse.json({ error: "Accès administrateur non configuré." }, { status: 503 });
  }

  const ip = adresseIp(request);
  if (limiteAtteinte(ip)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 });
  }

  let corps: Record<string, unknown>;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const saisi = typeof corps.motDePasse === "string" ? corps.motDePasse : "";
  if (!motDePasseValide(saisi)) {
    enregistrerEchec(ip);
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  reinitialiserEchecs(ip);
  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.set(COOKIE_NOM, genererJeton(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return reponse;
}

export async function DELETE() {
  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.delete(COOKIE_NOM);
  return reponse;
}
