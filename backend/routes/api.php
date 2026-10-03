<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConfiguracaoCadastroController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquipamentoController;
use App\Http\Controllers\Api\FinancasController;
use App\Http\Controllers\Api\FuncionarioController;
use App\Http\Controllers\Api\ProjetoController;
use Illuminate\Support\Facades\Route;

// Públicas
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');

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
});
