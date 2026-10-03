<?php

namespace App\Models;

use App\Models\Concerns\Auditavel;
use App\Models\Concerns\PertenceAOrganizacao;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

#[Table('contas_pagar')]
#[Fillable(['fornecedor', 'valor', 'data_vencimento', 'status', 'descricao', 'categoria'])]
class ContaPagar extends Model
{
    use Auditavel, PertenceAOrganizacao;

    protected function casts(): array
    {
        return [
            'valor' => 'float',
            'data_vencimento' => 'date',
        ];
    }
}
