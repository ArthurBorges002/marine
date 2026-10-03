<?php

namespace App\Models;

use App\Models\Concerns\PertenceAOrganizacao;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('funcionario_certificacoes')]
#[Fillable(['funcionario_id', 'nome'])]
class FuncionarioCertificacao extends Model
{
    use PertenceAOrganizacao;

    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class);
    }
}
