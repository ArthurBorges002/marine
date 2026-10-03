import React from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  aberto: boolean;
  titulo: string;
  descricao: string;
  textoConfirmar: string;
  /** Ação que remove, suspende ou bloqueia algo: botão em vermelho. */
  destrutivo?: boolean;
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Confirmação antes de ações com efeito relevante. Fica aberta até a ação terminar. */
const ConfirmarAcao: React.FC<Props> = ({
  aberto,
  titulo,
  descricao,
  textoConfirmar,
  destrutivo,
  carregando,
  onConfirmar,
  onCancelar,
}) => (
  <AlertDialog open={aberto} onOpenChange={(abrir) => !abrir && !carregando && onCancelar()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{titulo}</AlertDialogTitle>
        <AlertDialogDescription>{descricao}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={carregando}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          disabled={carregando}
          className={cn(destrutivo && buttonVariants({ variant: "destructive" }))}
          onClick={(e) => {
            e.preventDefault();
            onConfirmar();
          }}
        >
          {carregando && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {textoConfirmar}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmarAcao;
