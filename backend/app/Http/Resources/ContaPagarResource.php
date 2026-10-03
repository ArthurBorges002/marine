<?php

namespace App\Http\Resources;

use App\Models\ContaPagar;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ContaPagar */
class ContaPagarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'fornecedor' => $this->fornecedor,
            'valor' => $this->valor,
            'dataVencimento' => $this->data_vencimento?->toDateString(),
            'status' => $this->status,
            'descricao' => $this->descricao,
            'categoria' => $this->categoria,
        ];
    }
}
