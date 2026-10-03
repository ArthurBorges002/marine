<?php

namespace App\Models;

use App\Models\Concerns\PertenceAOrganizacao;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

/** Quais campos aparecem em cada tela de cadastro, por organização. */
#[Table('configuracoes_cadastro')]
#[Fillable(['tela', 'configuracao'])]
class ConfiguracaoCadastro extends Model
{
    use PertenceAOrganizacao;

    public const TELA_FUNCIONARIO = 1;

    /** Configuração usada enquanto a organização não salvou a sua: tudo visível. */
    public const PADRAO = [
        self::TELA_FUNCIONARIO => [
            'principal' => [
                'mostrarBloco' => true, 'nomeCompleto' => true, 'dataNascimento' => true, 'cpf' => true,
                'rg' => true, 'genero' => true, 'estadoCivil' => true, 'nacionalidade' => true,
            ],
            'endereco' => [
                'mostrarBloco' => true, 'cep' => true, 'logradouro' => true, 'numero' => true,
                'complemento' => true, 'bairro' => true, 'cidade' => true, 'estado' => true,
            ],
            'contato' => ['mostrarBloco' => true, 'telefone1' => true, 'telefone2' => true, 'email' => true],
            'dadosProfissionais' => [
                'mostrarBloco' => true, 'funcaoCargo' => true, 'departamentoSetor' => true, 'tipoContrato' => true,
                'salarioBase' => true, 'jornadaTrabalho' => true, 'supervisorResponsavel' => true,
            ],
            'documento' => ['documentosFuncionario' => true],
            'certificacoes' => ['certificacoesFuncionario' => true],
        ],
    ];

    protected function casts(): array
    {
        return [
            'tela' => 'integer',
            'configuracao' => 'array',
        ];
    }

    /** Configuração da tela na organização atual (ou a padrão). */
    public static function daTela(int $tela): array
    {
        return static::firstWhere('tela', $tela)?->configuracao ?? self::PADRAO[$tela];
    }
}
