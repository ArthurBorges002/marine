<?php

namespace App\Providers;

use App\Support\OrganizacaoAtual;
use Illuminate\Http\Resources\Json\JsonResource;
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
    }
}
