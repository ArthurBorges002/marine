<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

#[Table('configuracoes_cadastro', incrementing: false)]
#[Fillable(['id', 'tela', 'configuracao'])]
class ConfiguracaoCadastro extends Model
{
    protected function casts(): array
    {
        return [
            'configuracao' => 'array',
        ];
    }
}
