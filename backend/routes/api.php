<?php

use App\Http\Controllers\Api\Admin\AuditoriaController;
use App\Http\Controllers\Api\Admin\PerfilController;
use App\Http\Controllers\Api\Admin\UsuarioController;
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
    // Conta do próprio usuário (qualquer usuário autenticado)
    Route::get('me', [AuthController::class, 'me']);
    Route::put('me/senha', [AuthController::class, 'alterarSenha'])->middleware('throttle:10,1');
    Route::post('logout', [AuthController::class, 'logout']);

    // Administração do SaaS (dono da plataforma)
    Route::middleware('plataforma')->prefix('plataforma')->group(function () {
        Route::apiResource('organizacoes', OrganizacaoController::class)
            ->parameters(['organizacoes' => 'organizacao'])->only(['index', 'store', 'update']);
    });

    // Rotas de negócio: sempre dentro da organização do usuário e com permissão do catálogo
    Route::middleware('organizacao')->group(function () {
        Route::get('dashboard', DashboardController::class)->middleware('can:dashboard.ver');
        Route::get('equipamentos', [EquipamentoController::class, 'index'])->middleware('can:operacional.equipamentos.ver');
        Route::get('projetos', [ProjetoController::class, 'index'])->middleware('can:contratos.projetos.ver');
        Route::get('financas', FinancasController::class)->middleware('can:financeiro.ver');

        // Funcionários
        Route::get('funcionarios', [FuncionarioController::class, 'index'])->middleware('can:rh.funcionarios.ver');
        Route::get('funcionarios/{funcionario}', [FuncionarioController::class, 'show'])->middleware('can:rh.funcionarios.ver');
        Route::post('funcionarios', [FuncionarioController::class, 'store'])->middleware('can:rh.funcionarios.criar');
        Route::put('funcionarios/{funcionario}', [FuncionarioController::class, 'update'])->middleware('can:rh.funcionarios.editar');
        Route::get('configuracoes-cadastro/{tela}', [ConfiguracaoCadastroController::class, 'show'])
            ->whereNumber('tela')->middleware('can:rh.funcionarios.ver');
        Route::put('configuracoes-cadastro/{tela}', [ConfiguracaoCadastroController::class, 'update'])
            ->whereNumber('tela')->middleware('can:admin.configuracoes.editar');

        // Administração da organização
        Route::get('usuarios', [UsuarioController::class, 'index'])->middleware('can:admin.usuarios.ver');
        Route::get('usuarios/perfis', [PerfilController::class, 'opcoes'])->middleware('can:admin.usuarios.ver');
        Route::post('usuarios', [UsuarioController::class, 'store'])->middleware('can:admin.usuarios.criar');
        Route::put('usuarios/{usuario}', [UsuarioController::class, 'update'])->whereNumber('usuario')->middleware('can:admin.usuarios.editar');

        Route::get('perfis/catalogo', [PerfilController::class, 'catalogo'])->middleware('can:admin.perfis.ver');
        Route::get('perfis', [PerfilController::class, 'index'])->middleware('can:admin.perfis.ver');
        Route::post('perfis', [PerfilController::class, 'store'])->middleware('can:admin.perfis.gerenciar');
        Route::put('perfis/{perfil}', [PerfilController::class, 'update'])->middleware('can:admin.perfis.gerenciar');
        Route::delete('perfis/{perfil}', [PerfilController::class, 'destroy'])->middleware('can:admin.perfis.gerenciar');

        Route::get('auditorias', [AuditoriaController::class, 'index'])->middleware('can:admin.auditoria.ver');
    });
});
