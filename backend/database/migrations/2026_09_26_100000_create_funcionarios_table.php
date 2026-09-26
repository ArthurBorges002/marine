<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('funcionarios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->date('data_nascimento')->nullable();
            $table->string('cpf', 14)->nullable()->unique();
            $table->string('rg', 20)->nullable();
            $table->string('genero', 30)->nullable();
            $table->string('estado_civil', 30)->nullable();
            $table->string('nacionalidade', 60)->nullable();
            $table->string('estado', 2)->nullable();
            $table->string('cidade', 120)->nullable();
            $table->string('cep', 9)->nullable();
            $table->string('logradouro')->nullable();
            $table->string('complemento')->nullable();
            $table->string('numero', 20)->nullable();
            $table->string('bairro', 120)->nullable();
            $table->string('funcao_cargo', 120)->nullable();
            $table->string('departamento_setor', 120)->nullable();
            $table->string('tipo_contrato', 60)->nullable();
            $table->decimal('salario_base', 12, 2)->nullable();
            $table->string('telefone_principal', 20)->nullable();
            $table->string('telefone_secundario', 20)->nullable();
            $table->string('email')->nullable();
            $table->date('data_admissao')->nullable();
            $table->date('proximo_exame')->nullable();
            $table->enum('status', ['ativo', 'inativo'])->default('ativo')->index();
            $table->timestamps();
        });

        Schema::create('funcionario_certificacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('funcionario_id')->constrained('funcionarios')->cascadeOnDelete();
            $table->string('nome');
            $table->timestamps();

            $table->unique(['funcionario_id', 'nome']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funcionario_certificacoes');
        Schema::dropIfExists('funcionarios');
    }
};
