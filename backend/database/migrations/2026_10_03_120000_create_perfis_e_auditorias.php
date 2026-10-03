<?php

use App\Support\PerfisPadrao;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Etapa 2C do plano de migração: perfis com permissões por organização e auditoria.
 * O catálogo de permissões vive no código (App\Support\Permissoes); o banco guarda
 * só quais chaves cada perfil recebeu. usuarios.tipo (admin/usuario) vira perfil.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perfis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizacao_id')->constrained('organizacoes')->restrictOnDelete();
            $table->string('nome', 60);
            $table->string('descricao')->nullable();
            // Administrador: acesso total, não pode ser editado nem excluído
            $table->boolean('administrador')->default(false);
            $table->timestamps();

            $table->unique(['organizacao_id', 'nome']);
        });

        Schema::create('perfil_permissoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('perfil_id')->constrained('perfis')->cascadeOnDelete();
            $table->string('permissao', 100);

            $table->unique(['perfil_id', 'permissao']);
        });

        Schema::table('usuarios', function (Blueprint $table) {
            $table->foreignId('perfil_id')->nullable()->after('organizacao_id')->constrained('perfis')->restrictOnDelete();
            $table->boolean('ativo')->default(true)->after('administrador_plataforma');
            $table->timestamp('ultimo_acesso_em')->nullable()->after('ativo');
        });

        Schema::create('auditorias', function (Blueprint $table) {
            $table->id();
            // Nulo = ação na plataforma ou tentativa de login de email inexistente
            $table->foreignId('organizacao_id')->nullable()->constrained('organizacoes')->nullOnDelete();
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->string('acao', 30); // criado, atualizado, excluido, login, login_falhou
            $table->string('auditavel_type')->nullable();
            $table->unsignedBigInteger('auditavel_id')->nullable();
            $table->json('antes')->nullable();
            $table->json('depois')->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['organizacao_id', 'created_at']);
            $table->index(['auditavel_type', 'auditavel_id']);
        });

        // Perfis padrão em cada organização existente; tipo antigo -> perfil
        foreach (DB::table('organizacoes')->pluck('id') as $organizacaoId) {
            $perfis = PerfisPadrao::criarNoBanco($organizacaoId);
            DB::table('usuarios')->where('organizacao_id', $organizacaoId)->where('tipo', 'admin')
                ->update(['perfil_id' => $perfis['Administrador']]);
            DB::table('usuarios')->where('organizacao_id', $organizacaoId)->where('tipo', '<>', 'admin')
                ->update(['perfil_id' => $perfis['Consulta']]);
        }

        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn('tipo');
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->enum('tipo', ['admin', 'usuario'])->default('usuario')->after('password');
        });

        $administradores = DB::table('perfis')->where('administrador', true)->pluck('id');
        DB::table('usuarios')->whereIn('perfil_id', $administradores)->update(['tipo' => 'admin']);
        DB::table('usuarios')->whereNull('organizacao_id')->update(['tipo' => 'admin']);

        Schema::dropIfExists('auditorias');
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropConstrainedForeignId('perfil_id');
            $table->dropColumn(['ativo', 'ultimo_acesso_em']);
        });
        Schema::dropIfExists('perfil_permissoes');
        Schema::dropIfExists('perfis');
    }
};
