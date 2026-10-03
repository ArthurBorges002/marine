<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConfiguracaoCadastroController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquipamentoController;
use App\Http\Controllers\Api\FinancasController;
use App\Http\Controllers\Api\FuncionarioController;
use App\Http\Controllers\Api\Plataforma\OrganizacaoController;
use App\Http\Controllers\Api\ProjetoController;
use Illuminate\Support\Facades\Route;

// Públicas
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    // Administração do SaaS (dono da plataforma)
    Route::middleware('plataforma')->prefix('plataforma')->group(function () {
        Route::apiResource('organizacoes', OrganizacaoController::class)
            ->parameters(['organizacoes' => 'organizacao'])->only(['index', 'store', 'update']);
    });

    // Rotas de negócio: sempre dentro da organização do usuário
    Route::middleware('organizacao')->group(function () {
        Route::get('dashboard', DashboardController::class);
        Route::get('equipamentos', [EquipamentoController::class, 'index']);
        Route::get('projetos', [ProjetoController::class, 'index']);
        Route::get('financas', FinancasController::class);

        // Funcionários
        Route::apiResource('funcionarios', FuncionarioController::class)->except('destroy');
        Route::get('configuracoes-cadastro/{tela}', [ConfiguracaoCadastroController::class, 'show'])->whereNumber('tela');
        Route::put('configuracoes-cadastro/{tela}', [ConfiguracaoCadastroController::class, 'update'])->whereNumber('tela');
    });
});
