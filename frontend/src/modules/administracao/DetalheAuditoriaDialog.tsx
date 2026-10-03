import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarDataHora } from "@/lib/formatar";
import type { RegistroAuditoria } from "@/types";
import { NOMES_ACAO } from "./auditoria";

/** "data_nascimento" → "Data nascimento" */
const nomeCampo = (campo: string) => {
  const texto = campo.replace(/_id$/, "").replace(/_/g, " ");
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const formatarValor = (valor: unknown): string => {
  if (valor === null || valor === undefined || valor === "") return "—";
  if (typeof valor === "boolean") return valor ? "Sim" : "Não";
  if (Array.isArray(valor)) return valor.length ? valor.join(", ") : "(nenhum)";
  if (typeof valor === "object") return JSON.stringify(valor);
  return String(valor);
};

interface Props {
  registro: RegistroAuditoria | null;
  onFechar: () => void;
}

const DetalheAuditoriaDialog: React.FC<Props> = ({ registro, onFechar }) => {
  const campos = registro ? [...new Set([...Object.keys(registro.antes ?? {}), ...Object.keys(registro.depois ?? {})])] : [];
  const comAntes = !!registro?.antes && registro.acao === "atualizado";

  return (
    <Dialog open={registro !== null} onOpenChange={(abrir) => !abrir && onFechar()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        {registro && (
          <>
            <DialogHeader>
              <DialogTitle>
                {NOMES_ACAO[registro.acao]}
                {registro.entidadeNome && ` · ${registro.entidadeNome}${registro.registroId ? ` #${registro.registroId}` : ""}`}
              </DialogTitle>
              <DialogDescription>
                {formatarDataHora(registro.em)} por {registro.usuario?.nome ?? "usuário removido"}
                {registro.ip && ` · IP ${registro.ip}`}
              </DialogDescription>
            </DialogHeader>

            {campos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados alterados neste registro.</p>
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
                <Table>
                  <caption className="sr-only">Campos do registro</caption>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Campo</TableHead>
                      {comAntes && <TableHead>Antes</TableHead>}
                      <TableHead>{comAntes ? "Depois" : "Valor"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campos.map((campo) => (
                      <TableRow key={campo}>
                        <TableCell className="font-medium whitespace-nowrap">{nomeCampo(campo)}</TableCell>
                        {comAntes && (
                          <TableCell className="text-muted-foreground [overflow-wrap:anywhere]">
                            {formatarValor(registro.antes?.[campo])}
                          </TableCell>
                        )}
                        <TableCell className="[overflow-wrap:anywhere]">
                          {formatarValor((registro.acao === "excluido" ? registro.antes : registro.depois)?.[campo])}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetalheAuditoriaDialog;
