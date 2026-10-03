// Formatação de valores para exibição (pt-BR).

/** "12345678000190" → "12.345.678/0001-90"; "12345678901" → "123.456.789-01". */
export function formatarDocumento(documento: string | null | undefined): string {
  if (!documento) return "—";
  const d = documento.replace(/\D/g, "");
  if (d.length === 14) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  if (d.length === 11) return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  return documento;
}

/** "2026-10-03" → "03/10/2026" (sem conversão de fuso). */
export function formatarData(data: string | null | undefined): string {
  if (!data) return "—";
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}
