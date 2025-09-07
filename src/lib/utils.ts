import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes do Tailwind de forma inteligente,
 * evitando conflitos e sobrescrevendo corretamente.
 *
 * @param inputs - lista de classes a serem combinadas
 * @returns string com as classes combinadas e mescladas
 *
 * @example
 * cn("p-2", "p-4") // retorna "p-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

/**
 * Reduz uma string longa, exibindo apenas os primeiros e últimos
 * caracteres, separados por reticências. Útil para chaves públicas.
 *
 * @param str - string a ser encurtada
 * @returns string no formato "XXXX...YYYY"
 *
 * @example
 * ellipsis("GAR7F3VUJHG4EYCQB72LXKD6QGJRYBNG6HW3LNEMEIHPAD2U7EANE5SQ")
 * // retorna "GAR7...5SQ"
 */
export function ellipsis(str: string) {
  return str.slice(0, 4) + '...' + str.slice(-4);
};
