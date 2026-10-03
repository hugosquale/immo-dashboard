import { NextResponse } from "next/server";
import { COOKIE_NOM, jetonValide } from "@/lib/adminAuth";
import { listerUtilisateurs, toutesLues, TITRES, PAGES } from "@/lib/suiviServeur";

export async function GET(request: Request) {
  const jeton = request.headers
    .get("cookie")
    ?.split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${COOKIE_NOM}=`))
    ?.slice(COOKIE_NOM.length + 1);

  if (!jetonValide(jeton)) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const { utilisateurs, source } = await listerUtilisateurs();
    const tries = [...utilisateurs].sort((a, b) => b.derniere.localeCompare(a.derniere));
    return NextResponse.json({
      source,
      pages: PAGES.map((cle, i) => ({ cle, titre: TITRES[i] })),
      clients: tries.map((u) => ({ ...u, toutesLues: toutesLues(u.progression) })),
    });
  } catch (error) {
    console.error("[/api/admin/clients]", error);
    return NextResponse.json({ error: "Lecture du suivi impossible." }, { status: 502 });
  }
}
