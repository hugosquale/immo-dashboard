import { NextResponse } from "next/server";
import { connecter, progresser, archivageActif } from "@/lib/suiviServeur";

export async function POST(request: Request) {
  let corps: Record<string, unknown>;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  try {
    if (corps.action === "connexion") {
      const prenom = typeof corps.prenom === "string" ? corps.prenom.trim() : "";
      const nom = typeof corps.nom === "string" ? corps.nom.trim() : "";
      if (!prenom || !nom || prenom.length > 60 || nom.length > 60) {
        return NextResponse.json({ error: "Prénom et nom requis." }, { status: 400 });
      }
      const { utilisateur, rapproche } = await connecter(prenom, nom);
      return NextResponse.json({ utilisateur, rapproche, archivage: archivageActif() });
    }

    if (corps.action === "progression") {
      const cle = typeof corps.cle === "string" ? corps.cle : "";
      const page = typeof corps.page === "string" ? corps.page : "";
      const pourcentage = Number(corps.pourcentage);
      if (!cle || !page || !Number.isFinite(pourcentage)) {
        return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
      }
      const utilisateur = await progresser(cle, page, pourcentage);
      if (!utilisateur) return NextResponse.json({ error: "Utilisateur inconnu." }, { status: 404 });
      return NextResponse.json({ utilisateur });
    }

    return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
  } catch (error) {
    console.error("[/api/suivi]", error);
    return NextResponse.json({ error: "Le suivi est momentanément indisponible." }, { status: 502 });
  }
}
