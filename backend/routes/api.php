<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConfiguracaoCadastroController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquipamentoController;
use App\Http\Controllers\Api\FinancasController;
use App\Http\Controllers\Api\FuncionarioController;
use App\Http\Controllers\Api\ModeloCapaController;
use App\Http\Controllers\Api\ModeloOrcamentoController;
use App\Http\Controllers\Api\OrcamentoController;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Api\ProjetoController;
use App\Http\Controllers\Api\TemplatePdfController;
use Illuminate\Support\Facades\Route;

// Públicas
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::get('templates-pdf/imagem/{arquivo}', [TemplatePdfController::class, 'imagem'])->name('templates-pdf.imagem');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('dashboard', DashboardController::class);
    Route::get('equipamentos', [EquipamentoController::class, 'index']);
    Route::get('projetos', [ProjetoController::class, 'index']);
    Route::get('financas', FinancasController::class);

    // Funcionários
    Route::apiResource('funcionarios', FuncionarioController::class)->except('destroy');
    Route::get('configuracoes-cadastro/{configuracao}', [ConfiguracaoCadastroController::class, 'show']);
    Route::put('configuracoes-cadastro/{configuracao}', [ConfiguracaoCadastroController::class, 'update']);

    // Orçamentos
    Route::get('orcamentos/proximo-numero', [OrcamentoController::class, 'proximoNumero']);
    Route::get('orcamentos/{orcamento}/pdf', [OrcamentoController::class, 'pdf']);
    Route::patch('orcamentos/{orcamento}/status', [OrcamentoController::class, 'alterarStatus']);
    Route::apiResource('orcamentos', OrcamentoController::class);

    Route::apiResource('modelos-orcamento', ModeloOrcamentoController::class)
        ->parameters(['modelos-orcamento' => 'modelo'])->except('destroy');
    Route::apiResource('modelos-capa', ModeloCapaController::class)
        ->parameters(['modelos-capa' => 'modelo'])->except('destroy');

    Route::get('templates-pdf/capas', [TemplatePdfController::class, 'capas']);
    Route::get('templates-pdf/documentos', [TemplatePdfController::class, 'documentos']);
    Route::post('templates-pdf', [TemplatePdfController::class, 'store']);

    // Pré-visualização de PDF a partir do conteúdo dos editores
    Route::post('pdf/documento', [PdfController::class, 'documento']);
    Route::post('pdf/capa', [PdfController::class, 'capa']);
});
