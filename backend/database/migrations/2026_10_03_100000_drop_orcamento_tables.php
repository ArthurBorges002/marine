<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Etapa 1 do plano de migração: orçamentos não fazem parte do Integra.
 * Os dados eram apenas de teste e foram descartados sem exportação (decisão de 03/10/2026).
 * templates_pdf (papel timbrado) continua: é usado pelo PdfService.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('orcamentos');
        Schema::dropIfExists('modelos_capa');
        Schema::dropIfExists('modelos_orcamento');
    }

    /** Recria a estrutura (vazia) de 2026_09_26_100200_create_orcamento_tables. */
    public function down(): void
    {
        Schema::create('modelos_orcamento', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->text('cabecalho')->nullable();
            $table->text('corpo')->nullable();
            $table->text('rodape')->nullable();
            $table->foreignId('criado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('atualizado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('modelos_capa', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->text('conteudo')->nullable();
            $table->foreignId('criado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('atualizado_por_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('orcamentos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_interno', 20)->unique();
            $table->foreignId('modelo_orcamento_id')->nullable()->constrained('modelos_orcamento')->nullOnDelete();
            $table->foreignId('modelo_capa_id')->nullable()->constrained('modelos_capa')->nullOnDelete();
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('ultimo_editor_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->string('template_capa', 191)->nullable();
            $table->string('template_documento', 191)->nullable();
            $table->string('marca_dagua_capa')->nullable();
            $table->string('marca_dagua_documento')->nullable();
            $table->string('nome_cliente');
            $table->string('estado', 2)->nullable();
            $table->string('cidade', 120)->nullable();
            $table->text('info_complementar')->nullable();
            $table->decimal('valor_total', 14, 2)->default(0);
            $table->date('validade')->nullable();
            $table->enum('status', ['A', 'E', 'R'])->default('E')->index();
            $table->text('capa')->nullable();
            $table->text('cabecalho')->nullable();
            $table->text('corpo')->nullable();
            $table->text('rodape')->nullable();
            $table->timestamps();

            $table->index('created_at');
        });
    }
};
