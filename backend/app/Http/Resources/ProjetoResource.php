<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Projeto */
class ProjetoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'cliente' => $this->cliente,
            'local' => $this->local,
            'dataInicio' => $this->data_inicio?->toDateString(),
            'dataFim' => $this->data_fim?->toDateString(),
            'status' => $this->status,
            'progresso' => $this->progresso,
            'orcamento' => $this->orcamento,
            'gastoReal' => $this->gasto_real,
            'responsavel' => $this->whenLoaded('responsavel', fn () => $this->responsavel?->nome),
        ];
    }
}
