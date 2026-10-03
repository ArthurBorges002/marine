<?php

namespace App\Http\Resources;

use App\Models\Equipamento;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Equipamento */
class EquipamentoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'tipo' => $this->tipo,
            'marca' => $this->marca,
            'modelo' => $this->modelo,
            'numeroSerie' => $this->numero_serie,
            'quantidade' => $this->quantidade,
            'status' => $this->status,
            'proximaManutencao' => $this->proxima_manutencao?->toDateString(),
            'custoManutencao' => $this->custo_manutencao,
            'projetoAtual' => $this->whenLoaded('projeto', fn () => $this->projeto?->nome),
        ];
    }
}
