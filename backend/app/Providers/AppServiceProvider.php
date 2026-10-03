<?php

namespace App\Providers;

use App\Models\Usuario;
use App\Support\OrganizacaoAtual;
use App\Support\Permissoes;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Descartada a cada requisição/job, para a organização de um não vazar para outro
        $this->app->scoped(OrganizacaoAtual::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // O frontend consome os recursos diretamente (sem o envelope "data").
        JsonResource::withoutWrapping();

        // Permissões do catálogo (can:rh.funcionarios.ver etc.) são decididas pelo perfil do usuário
        Gate::before(function (Usuario $usuario, string $habilidade) {
            return Permissoes::existe($habilidade) ? $usuario->temPermissao($habilidade) : null;
        });
    }
}
