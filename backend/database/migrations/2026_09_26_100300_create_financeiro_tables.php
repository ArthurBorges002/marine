<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contas_receber', function (Blueprint $table) {
            $table->id();
            $table->string('cliente');
            $table->decimal('valor', 14, 2);
            $table->date('data_vencimento');
            $table->enum('status', ['pendente', 'pago', 'vencido'])->default('pendente')->index();
            $table->string('descricao');
            $table->foreignId('projeto_id')->nullable()->constrained('projetos')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('contas_pagar', function (Blueprint $table) {
            $table->id();
            $table->string('fornecedor');
            $table->decimal('valor', 14, 2);
            $table->date('data_vencimento');
            $table->enum('status', ['pendente', 'pago', 'vencido'])->default('pendente')->index();
            $table->string('descricao');
            $table->string('categoria', 60);
            $table->timestamps();
        });

        // Totais mensais de entradas/saídas. O saldo é acumulado e calculado na leitura.
        Schema::create('fluxo_caixa', function (Blueprint $table) {
            $table->id();
            $table->char('mes', 7)->unique(); // AAAA-MM
            $table->decimal('entradas', 14, 2)->default(0);
            $table->decimal('saidas', 14, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fluxo_caixa');
        Schema::dropIfExists('contas_pagar');
        Schema::dropIfExists('contas_receber');
    }
};
