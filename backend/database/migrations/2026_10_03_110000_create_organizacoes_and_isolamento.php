<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Etapa 2A do plano de migração: base SaaS.
 * Cada cliente é uma organização; todo registro de negócio passa a ter organizacao_id.
 * Dados existentes (protótipo) vão para a organização "Demonstração" — nada é apagado aqui.
 */
return new class extends Migration
{
    /** Tabelas de negócio que passam a pertencer a uma organização (organizacao_id obrigatório). */
    private const TABELAS = [
        'funcionarios', 'funcionario_certificacoes', 'projetos', 'equipamentos',
        'contas_pagar', 'contas_receber', 'fluxo_caixa', 'templates_pdf',
    ];

    /** Índices únicos que passam a valer por organização: tabela => coluna. */
    private const UNICOS = [
        'funcionarios' => 'cpf',
        'equipamentos' => 'numero_serie',
        'fluxo_caixa' => 'mes',
    ];

    public function up(): void
    {
        Schema::create('organizacoes', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('documento', 18)->nullable()->unique(); // CPF/CNPJ do contratante
            $table->enum('status', ['ativa', 'suspensa'])->default('ativa')->index();
            $table->string('plano', 40)->nullable();
            $table->timestamps();
        });

        // Usuário sem organização = administrador da plataforma
        Schema::table('usuarios', function (Blueprint $table) {
            $table->foreignId('organizacao_id')->nullable()->after('id')->constrained('organizacoes')->restrictOnDelete();
            $table->boolean('administrador_plataforma')->default(false)->after('tipo');
        });

        foreach (self::TABELAS as $tabela) {
            Schema::table($tabela, function (Blueprint $table) {
                $table->foreignId('organizacao_id')->nullable()->after('id')->constrained('organizacoes')->restrictOnDelete();
            });
        }

        $demonstracao = $this->organizacaoDemonstracao();
        if ($demonstracao) {
            DB::table('usuarios')->update(['organizacao_id' => $demonstracao]);
            foreach (self::TABELAS as $tabela) {
                DB::table($tabela)->update(['organizacao_id' => $demonstracao]);
            }
        }

        foreach (self::TABELAS as $tabela) {
            Schema::table($tabela, function (Blueprint $table) {
                $table->foreignId('organizacao_id')->nullable(false)->change();
            });
        }

        foreach (self::UNICOS as $tabela => $coluna) {
            Schema::table($tabela, function (Blueprint $table) use ($coluna) {
                $table->dropUnique([$coluna]);
                $table->unique(['organizacao_id', $coluna]);
            });
        }

        $this->recriarConfiguracoesCadastro($demonstracao);
    }

    public function down(): void
    {
        // Volta ao formato antigo (id = código da tela): fica a configuração mais antiga de cada tela
        $configuracoes = DB::table('configuracoes_cadastro')->orderBy('id')->get()->unique('tela');
        Schema::dropIfExists('configuracoes_cadastro');
        Schema::create('configuracoes_cadastro', function (Blueprint $table) {
            $table->unsignedSmallInteger('id')->primary();
            $table->string('tela', 60);
            $table->json('configuracao');
            $table->timestamps();
        });
        foreach ($configuracoes as $configuracao) {
            DB::table('configuracoes_cadastro')->insert([
                'id' => $configuracao->tela,
                'tela' => $configuracao->tela == 1 ? 'funcionario' : (string) $configuracao->tela,
                'configuracao' => $configuracao->configuracao,
                'created_at' => $configuracao->created_at,
                'updated_at' => $configuracao->updated_at,
            ]);
        }

        foreach (self::UNICOS as $tabela => $coluna) {
            Schema::table($tabela, function (Blueprint $table) use ($coluna) {
                $table->dropUnique(['organizacao_id', $coluna]);
                $table->unique($coluna);
            });
        }

        foreach (self::TABELAS as $tabela) {
            Schema::table($tabela, function (Blueprint $table) {
                $table->dropConstrainedForeignId('organizacao_id');
            });
        }

        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropConstrainedForeignId('organizacao_id');
            $table->dropColumn('administrador_plataforma');
        });

        Schema::dropIfExists('organizacoes');
    }

    /** Cria a organização "Demonstração" se já houver dados; devolve o id ou null. */
    private function organizacaoDemonstracao(): ?int
    {
        $temDados = DB::table('usuarios')->exists()
            || collect(self::TABELAS)->contains(fn (string $t) => DB::table($t)->exists());

        if (! $temDados) {
            return null;
        }

        return DB::table('organizacoes')->insertGetId([
            'nome' => 'Demonstração',
            'status' => 'ativa',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * A chave antiga era o código da tela (id = 1). Agora a configuração é por organização:
     * única por (organizacao_id, tela).
     */
    private function recriarConfiguracoesCadastro(?int $demonstracao): void
    {
        $antigas = DB::table('configuracoes_cadastro')->get();

        Schema::drop('configuracoes_cadastro');
        Schema::create('configuracoes_cadastro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizacao_id')->constrained('organizacoes')->restrictOnDelete();
            $table->unsignedSmallInteger('tela'); // 1 = cadastro de funcionário
            $table->json('configuracao');
            $table->timestamps();

            $table->unique(['organizacao_id', 'tela']);
        });

        if ($demonstracao) {
            foreach ($antigas as $antiga) {
                DB::table('configuracoes_cadastro')->insert([
                    'organizacao_id' => $demonstracao,
                    'tela' => $antiga->id,
                    'configuracao' => $antiga->configuracao,
                    'created_at' => $antiga->created_at,
                    'updated_at' => $antiga->updated_at,
                ]);
            }
        }
    }
};
