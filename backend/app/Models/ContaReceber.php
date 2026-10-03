<?php

namespace App\Models;

use App\Models\Concerns\Auditavel;
use App\Models\Concerns\PertenceAOrganizacao;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('contas_receber')]
#[Fillable(['cliente', 'valor', 'data_vencimento', 'status', 'descricao', 'projeto_id'])]
class ContaReceber extends Model
{
    use Auditavel, PertenceAOrganizacao;

    protected function casts(): array
    {
        return [
            'valor' => 'float',
            'data_vencimento' => 'date',
        ];
    }

    public function projeto(): BelongsTo
    {
        return $this->belongsTo(Projeto::class);
    }
}
