<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ContaReceber */
class ContaReceberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cliente' => $this->cliente,
            'valor' => $this->valor,
            'dataVencimento' => $this->data_vencimento?->toDateString(),
            'status' => $this->status,
            'descricao' => $this->descricao,
            'projeto' => $this->whenLoaded('projeto', fn () => $this->projeto?->nome),
        ];
    }
}
