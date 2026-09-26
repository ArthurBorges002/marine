import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { mensagemErro } from '@/lib/api';

interface QueryStateProps {
  isLoading: boolean;
  error: unknown;
}

/** Estado de carregamento/erro padrão para telas que buscam dados na API. */
const QueryState: React.FC<QueryStateProps> = ({ isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground p-6">
        <Loader2 className="w-5 h-5 animate-spin" />
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 border border-destructive/20 bg-destructive/5 rounded-lg text-destructive">
        <AlertCircle className="w-5 h-5" />
        {mensagemErro(error)}
      </div>
    );
  }

  return null;
};

export default QueryState;
