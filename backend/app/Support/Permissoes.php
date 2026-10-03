<?php

namespace App\Support;

/**
 * Catálogo de permissões do Integra (formato modulo.recurso.acao).
 * Fica no código: cada etapa que cria um módulo acrescenta as suas aqui.
 * Toda rota de negócio usa uma destas chaves no middleware "can:" (ArquiteturaTest).
 */
class Permissoes
{
    /** chave => [módulo, descrição] */
    public const CATALOGO = [
        'dashboard.ver' => ['Dashboard', 'Ver o dashboard'],

        'rh.funcionarios.ver' => ['RH', 'Ver funcionários'],
        'rh.funcionarios.criar' => ['RH', 'Cadastrar funcionários'],
        'rh.funcionarios.editar' => ['RH', 'Editar funcionários'],

        'operacional.equipamentos.ver' => ['Operacional', 'Ver equipamentos'],

        'contratos.projetos.ver' => ['Contratos e projetos', 'Ver projetos'],

        'financeiro.ver' => ['Financeiro', 'Ver finanças'],

        'admin.usuarios.ver' => ['Administração', 'Ver usuários'],
        'admin.usuarios.criar' => ['Administração', 'Cadastrar usuários'],
        'admin.usuarios.editar' => ['Administração', 'Editar e desativar usuários'],
        'admin.perfis.ver' => ['Administração', 'Ver perfis e permissões'],
        'admin.perfis.gerenciar' => ['Administração', 'Criar, editar e excluir perfis'],
        'admin.auditoria.ver' => ['Administração', 'Consultar a auditoria'],
        'admin.configuracoes.editar' => ['Administração', 'Personalizar cadastros'],
    ];

    /** @return list<string> */
    public static function chaves(): array
    {
        return array_keys(self::CATALOGO);
    }

    public static function existe(string $chave): bool
    {
        return array_key_exists($chave, self::CATALOGO);
    }

    /** Catálogo agrupado por módulo, para a tela de perfis. */
    public static function porModulo(): array
    {
        $grupos = [];
        foreach (self::CATALOGO as $chave => [$modulo, $descricao]) {
            $grupos[$modulo][] = ['chave' => $chave, 'descricao' => $descricao];
        }

        return collect($grupos)->map(fn ($itens, $modulo) => ['modulo' => $modulo, 'permissoes' => $itens])->values()->all();
    }
}
