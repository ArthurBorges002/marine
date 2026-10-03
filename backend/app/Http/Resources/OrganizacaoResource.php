<?php

namespace App\Http\Resources;

use App\Models\Organizacao;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Organizacao */
class OrganizacaoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'documento' => $this->documento,
            'status' => $this->status,
            'plano' => $this->plano,
            'usuarios' => $this->whenCounted('usuarios'),
            'criadaEm' => $this->created_at?->toDateString(),
        ];
    }
}
