<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A imagem do template passa a ser guardada no banco (base64), para não
     * depender do disco do servidor (storage não versionado / deploy efêmero).
     */
    public function up(): void
    {
        Schema::table('templates_pdf', function (Blueprint $table) {
            $table->longText('conteudo_base64')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('templates_pdf', function (Blueprint $table) {
            $table->dropColumn('conteudo_base64');
        });
    }
};
