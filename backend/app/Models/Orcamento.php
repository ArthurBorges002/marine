<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('orcamentos')]
#[Fillable([
    'codigo_interno', 'modelo_orcamento_id', 'modelo_capa_id', 'usuario_id', 'ultimo_editor_id',
    'template_capa', 'template_documento', 'marca_dagua_capa', 'marca_dagua_documento',
    'nome_cliente', 'estado', 'cidade', 'info_complementar', 'valor_total', 'validade', 'status',
    'capa', 'cabecalho', 'corpo', 'rodape',
])]
class Orcamento extends Model
{
    public const STATUS = ['A', 'E', 'R'];

    protected function casts(): array
    {
        return [
            'valor_total' => 'decimal:2',
            'validade' => 'date',
        ];
    }

    public function modeloOrcamento(): BelongsTo
    {
        return $this->belongsTo(ModeloOrcamento::class);
    }

    public function modeloCapa(): BelongsTo
    {
        return $this->belongsTo(ModeloCapa::class);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function ultimoEditor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'ultimo_editor_id');
    }
}
