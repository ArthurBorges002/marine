<?php

namespace App\Models;

use App\Models\Concerns\PertenceAOrganizacao;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('equipamentos')]
#[Fillable([
    'nome', 'tipo', 'marca', 'modelo', 'numero_serie', 'quantidade', 'status',
    'proxima_manutencao', 'custo_manutencao', 'projeto_id',
])]
class Equipamento extends Model
{
    use PertenceAOrganizacao;

    protected function casts(): array
    {
        return [
            'quantidade' => 'integer',
            'proxima_manutencao' => 'date',
            'custo_manutencao' => 'float',
        ];
    }

    public function projeto(): BelongsTo
    {
        return $this->belongsTo(Projeto::class);
    }
}
