<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projetos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('cliente');
            $table->string('local');
            $table->date('data_inicio');
            $table->date('data_fim')->nullable();
            $table->enum('status', ['planejamento', 'em_andamento', 'concluido', 'cancelado'])->default('planejamento')->index();
            $table->unsignedTinyInteger('progresso')->default(0);
            $table->decimal('orcamento', 14, 2)->default(0);
            $table->decimal('gasto_real', 14, 2)->default(0);
            $table->foreignId('responsavel_id')->nullable()->constrained('funcionarios')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('equipamentos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('tipo', 60);
            $table->string('marca', 60);
            $table->string('modelo', 60);
            $table->string('numero_serie', 60)->unique();
            $table->unsignedInteger('quantidade')->default(1);
            $table->enum('status', ['disponivel', 'em_uso', 'manutencao', 'inativo'])->default('disponivel')->index();
            $table->date('proxima_manutencao')->nullable();
            $table->decimal('custo_manutencao', 12, 2)->nullable();
            $table->foreignId('projeto_id')->nullable()->constrained('projetos')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipamentos');
        Schema::dropIfExists('projetos');
    }
};
