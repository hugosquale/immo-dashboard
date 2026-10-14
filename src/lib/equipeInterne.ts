import { cleIdentite } from "./identite";

/**
 * Membres de l'équipe interne : accès à l'outil comme n'importe qui, mais
 * aucune trace de leur usage n'est conservée (ni Google Sheets, ni mémoire,
 * ni journal, ni panneau d'administration) — ce ne sont pas des clients
 * soumis à la garantie de lecture des recommandations.
 *
 * Pour ajouter quelqu'un : une ligne cleIdentite("Prénom", "Nom"). La
 * correspondance est exacte (accents/casse normalisés comme partout
 * ailleurs), mais sans tolérance aux fautes de frappe — à la différence du
 * rapprochement utilisé pour les clients, cette liste reste volontairement
 * stricte.
 */
const EQUIPE_INTERNE = new Set<string>([
  cleIdentite("Marwan", "Salih"),
  cleIdentite("Tristan", "Cordier"),
  cleIdentite("Hugo", "Venant"),
]);

export function estEquipeInterne(cle: string): boolean {
  return EQUIPE_INTERNE.has(cle);
}
