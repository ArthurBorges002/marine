import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mensagemErro } from "@/lib/api";
import { cn } from "@/lib/utils";

export interface Coluna<T> {
  /** Identificador único da coluna. */
  chave: string;
  cabecalho: React.ReactNode;
  celula: (item: T) => React.ReactNode;
  alinhar?: "esquerda" | "direita";
  /** Números, datas e valores: algarismos de largura fixa. */
  numerica?: boolean;
  className?: string;
}

interface Props<T> {
  colunas: Coluna<T>[];
  dados: T[] | undefined;
  chaveLinha: (item: T) => React.Key;
  carregando?: boolean;
  erro?: unknown;
  onTentarNovamente?: () => void;
  /** Conteúdo quando não há linhas (use EstadoVazio). */
  vazio?: React.ReactNode;
  /** Descrição da tabela para leitores de tela. */
  legenda?: string;
  linhasEsqueleto?: number;
}

/** Tabela padrão do Integra: rolagem horizontal no celular e estados de carregando/erro/vazio. */
function DataTable<T>({
  colunas,
  dados,
  chaveLinha,
  carregando,
  erro,
  onTentarNovamente,
  vazio,
  legenda,
  linhasEsqueleto = 4,
}: Props<T>) {
  if (erro && !carregando) {
    return (
      <Card className="shadow-card">
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center" role="alert">
          <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Não foi possível carregar os dados</p>
            <p className="text-sm text-muted-foreground">{mensagemErro(erro)}</p>
          </div>
          {onTentarNovamente && (
            <Button variant="outline" size="sm" onClick={onTentarNovamente}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Tentar novamente
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (!carregando && dados && dados.length === 0 && vazio) {
    return <Card className="shadow-card">{vazio}</Card>;
  }

  const alinhamento = (c: Coluna<T>) => cn(c.alinhar === "direita" && "text-right", c.numerica && "tabular-nums", c.className);

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table aria-busy={carregando || undefined}>
          {legenda && <caption className="sr-only">{legenda}</caption>}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {colunas.map((c) => (
                <TableHead key={c.chave} className={cn("whitespace-nowrap", alinhamento(c))}>
                  {c.cabecalho}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {carregando
              ? Array.from({ length: linhasEsqueleto }, (_, i) => (
                  <TableRow key={`esqueleto-${i}`} className="hover:bg-transparent">
                    {colunas.map((c) => (
                      <TableCell key={c.chave}>
                        <Skeleton className="h-4 w-full max-w-[160px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : dados?.map((item) => (
                  <TableRow key={chaveLinha(item)}>
                    {colunas.map((c) => (
                      <TableCell key={c.chave} className={alinhamento(c)}>
                        {c.celula(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default DataTable;
