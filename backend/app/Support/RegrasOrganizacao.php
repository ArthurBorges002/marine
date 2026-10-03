<?php

namespace App\Support;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;
use Illuminate\Validation\Rules\Unique;

/**
 * Regras de validação que consultam o banco direto (sem o escopo do Eloquent) precisam
 * filtrar a organização: um "unique" global revelaria dados de outro cliente e um "exists"
 * global aceitaria IDs de outro cliente. Use sempre estas em tabelas de negócio.
 */
class RegrasOrganizacao
{
    public static function unico(string $tabela, string $coluna = 'NULL'): Unique
    {
        return Rule::unique($tabela, $coluna)->where('organizacao_id', OrganizacaoAtual::id());
    }

    public static function existe(string $tabela, string $coluna = 'id'): Exists
    {
        return Rule::exists($tabela, $coluna)->where('organizacao_id', OrganizacaoAtual::id());
    }
}
