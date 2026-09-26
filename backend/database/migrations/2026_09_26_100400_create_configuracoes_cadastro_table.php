<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Quais campos aparecem nas telas de cadastro. O id identifica a tela (1 = cadastro de funcionário).
        Schema::create('configuracoes_cadastro', function (Blueprint $table) {
            $table->unsignedSmallInteger('id')->primary();
            $table->string('tela', 60);
            $table->json('configuracao');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracoes_cadastro');
    }
};
