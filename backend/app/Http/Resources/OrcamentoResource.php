<?php

namespace App\Http\Resources;

use App\Models\Orcamento;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Item da listagem de orçamentos.
 *
 * @mixin Orcamento
 */
class OrcamentoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'codigo' => $this->id,
            'codigo_interno' => $this->codigo_interno,
            'nome_cliente' => $this->nome_cliente,
            'cidade' => $this->cidade,
            'estado' => $this->estado,
            'info_complementar' => $this->info_complementar,
            'valor_total' => $this->valor_total,
            'criado_em_data' => $this->created_at?->toDateString(),
            'validade' => $this->validade?->toDateString(),
            'status' => $this->status,
        ];
    }
}
