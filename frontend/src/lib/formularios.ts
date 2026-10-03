import { ApiError } from "@/lib/api";

/**
 * Converte o 422 da API em erros por campo do formulário.
 * `chaves` mapeia o nome do campo no formulário para a chave de erro da API, na ordem do formulário.
 * Devolve null quando o erro não é de validação (mostrar em toast).
 */
export function errosPorCampo<C extends string>(err: unknown, chaves: Record<C, string>): Partial<Record<C, string>> | null {
  if (!(err instanceof ApiError) || err.status !== 422 || !err.errors) return null;

  const erros: Partial<Record<C, string>> = {};
  (Object.keys(chaves) as C[]).forEach((campo) => {
    const mensagem = err.errors?.[chaves[campo]]?.[0];
    if (mensagem) erros[campo] = mensagem;
  });
  return erros;
}

/** Leva o foco ao primeiro campo com erro (ids no formato `${prefixo}${campo}`). */
export function focarPrimeiroErro<C extends string>(ordem: C[], erros: Partial<Record<C, string>>, prefixo: string) {
  const primeiro = ordem.find((campo) => erros[campo]);
  if (primeiro) document.getElementById(`${prefixo}${primeiro}`)?.focus();
}
