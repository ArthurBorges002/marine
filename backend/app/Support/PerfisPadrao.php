<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

/**
 * Perfis com que toda organização nasce. O cliente pode editá-los (exceto o Administrador),
 * excluí-los e criar outros.
 */
class PerfisPadrao
{
    public const ADMINISTRADOR = 'Administrador';

    /** nome => [descrição, permissões (ou null = Administrador, acesso total)] */
    public static function definicoes(): array
    {
        $leitura = array_values(array_filter(
            Permissoes::chaves(),
            fn (string $p) => str_ends_with($p, '.ver') && ! str_starts_with($p, 'admin.'),
        ));

        return [
            self::ADMINISTRADOR => ['Acesso total, inclusive usuários, perfis e auditoria.', null],
            'Financeiro' => ['Finanças e custos dos projetos.', ['dashboard.ver', 'financeiro.ver', 'contratos.projetos.ver']],
            'RH' => ['Cadastro e gestão de funcionários.', ['dashboard.ver', 'rh.funcionarios.ver', 'rh.funcionarios.criar', 'rh.funcionarios.editar']],
            'Operacional' => ['Equipamentos, projetos e equipe.', ['dashboard.ver', 'operacional.equipamentos.ver', 'contratos.projetos.ver', 'rh.funcionarios.ver']],
            'Consulta' => ['Somente leitura de todos os módulos.', $leitura],
            'Funcionário' => ['Acesso do próprio funcionário (portal).', []],
        ];
    }

    /**
     * Cria os perfis padrão via query builder (usado também na migration).
     *
     * @return array<string, int> nome => id
     */
    public static function criarNoBanco(int $organizacaoId): array
    {
        $ids = [];
        foreach (self::definicoes() as $nome => [$descricao, $permissoes]) {
            $ids[$nome] = DB::table('perfis')->insertGetId([
                'organizacao_id' => $organizacaoId,
                'nome' => $nome,
                'descricao' => $descricao,
                'administrador' => $permissoes === null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            foreach ($permissoes ?? [] as $permissao) {
                DB::table('perfil_permissoes')->insert(['perfil_id' => $ids[$nome], 'permissao' => $permissao]);
            }
        }

        return $ids;
    }
}
