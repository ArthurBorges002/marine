<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Table('projetos')]
#[Fillable([
    'nome', 'cliente', 'local', 'data_inicio', 'data_fim', 'status',
    'progresso', 'orcamento', 'gasto_real', 'responsavel_id',
])]
class Projeto extends Model
{
    protected function casts(): array
    {
        return [
            'data_inicio' => 'date',
            'data_fim' => 'date',
            'progresso' => 'integer',
            'orcamento' => 'float',
            'gasto_real' => 'float',
        ];
    }

    public function responsavel(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class, 'responsavel_id');
    }

    public function equipamentos(): HasMany
    {
        return $this->hasMany(Equipamento::class);
    }

    public function contasReceber(): HasMany
    {
        return $this->hasMany(ContaReceber::class);
    }
}
