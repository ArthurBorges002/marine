<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('modelos_orcamento')]
#[Fillable(['nome', 'cabecalho', 'corpo', 'rodape', 'criado_por_id', 'atualizado_por_id'])]
class ModeloOrcamento extends Model
{
    public function criadoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'criado_por_id');
    }

    public function atualizadoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'atualizado_por_id');
    }
}
