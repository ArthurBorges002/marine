<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

#[Table('fluxo_caixa')]
#[Fillable(['mes', 'entradas', 'saidas'])]
class FluxoCaixa extends Model
{
    protected function casts(): array
    {
        return [
            'entradas' => 'float',
            'saidas' => 'float',
        ];
    }
}
