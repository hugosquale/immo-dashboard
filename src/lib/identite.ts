/* Identification déclarative d'un utilisateur par son prénom et son nom,
   tolérante aux fautes de frappe. Ce n'est pas de l'authentification :
   n'importe qui peut saisir n'importe quel nom. */

/** Minuscules, sans accents, sans ponctuation, espaces normalisés. */
export function normaliser(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Clé stable : prénom et nom normalisés, triés, pour que l'ordre de saisie n'importe pas. */
export function cleIdentite(prenom: string, nom: string): string {
  return [normaliser(prenom), normaliser(nom)].sort().join("|");
}

/** Distance de Levenshtein, en O(n·m) mémoire linéaire. */
export function distance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let precedente = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const courante = [i];
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1;
      courante[j] = Math.min(courante[j - 1] + 1, precedente[j] + 1, precedente[j - 1] + cout);
    }
    precedente = courante;
  }
  return precedente[b.length];
}

/** Fautes tolérées sur un champ, selon sa longueur. */
function tolerance(longueur: number): number {
  if (longueur <= 3) return 0;
  if (longueur <= 7) return 1;
  return 2;
}

/** Fautes tolérées au total sur le prénom + le nom. */
const TOTAL_MAX = 2;

export interface Connu {
  cle: string;
  prenom: string;
  nom: string;
}

/**
 * Cherche parmi les personnes déjà enregistrées celle qui correspond le mieux.
 * Compare prénom et nom séparément (et dans l'ordre inversé), pour rattraper
 * aussi bien une faute de frappe qu'une inversion des deux champs.
 */
export function rapprocher(prenom: string, nom: string, connus: Connu[]): Connu | null {
  const p = normaliser(prenom);
  const n = normaliser(nom);
  const cle = cleIdentite(prenom, nom);

  const exact = connus.find((c) => c.cle === cle);
  if (exact) return exact;

  let meilleur: { c: Connu; score: number } | null = null;

  for (const c of connus) {
    const cp = normaliser(c.prenom);
    const cn = normaliser(c.nom);

    // dans l'ordre, puis champs inversés
    const paires: Array<[number, number]> = [
      [distance(p, cp), distance(n, cn)],
      [distance(p, cn), distance(n, cp)],
    ];

    for (const [dp, dn] of paires) {
      const okPrenom = dp <= tolerance(Math.max(p.length, cp.length));
      const okNom = dn <= tolerance(Math.max(n.length, cn.length));
      if (okPrenom && okNom && dp + dn <= TOTAL_MAX) {
        const score = dp + dn;
        if (!meilleur || score < meilleur.score) meilleur = { c, score };
      }
    }
  }

  return meilleur ? meilleur.c : null;
}
