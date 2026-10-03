<?php

namespace Tests\Feature;

use App\Models\Concerns\PertenceAOrganizacao;
use App\Models\Organizacao;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/** Regras do SaaS que valem para todo código novo: falham se alguém esquecer o isolamento. */
class ArquiteturaTest extends TestCase
{
    use RefreshDatabase;

    /** Models que não pertencem a uma organização (justificativa no próprio model). */
    private const MODELS_FORA_DO_ISOLAMENTO = [Organizacao::class, Usuario::class];

    /** Rotas da API que não exigem organização nem administração da plataforma. */
    private const ROTAS_LIVRES = ['api/login', 'api/me', 'api/logout'];

    public function test_todo_model_de_negocio_usa_pertence_a_organizacao(): void
    {
        foreach (glob(app_path('Models/*.php')) as $arquivo) {
            $classe = 'App\\Models\\'.basename($arquivo, '.php');
            if (! is_subclass_of($classe, Model::class) || in_array($classe, self::MODELS_FORA_DO_ISOLAMENTO, true)) {
                continue;
            }

            $this->assertContains(PertenceAOrganizacao::class, class_uses_recursive($classe), "$classe não usa PertenceAOrganizacao");
            $this->assertTrue(
                Schema::hasColumn((new $classe)->getTable(), 'organizacao_id'),
                "Tabela de $classe não tem organizacao_id",
            );
        }
    }

    public function test_toda_rota_de_negocio_exige_organizacao_ou_plataforma(): void
    {
        foreach (Route::getRoutes() as $rota) {
            if (! str_starts_with($rota->uri(), 'api/') || in_array($rota->uri(), self::ROTAS_LIVRES, true)) {
                continue;
            }

            $middlewares = $rota->gatherMiddleware();
            $this->assertTrue(
                in_array('organizacao', $middlewares, true) || in_array('plataforma', $middlewares, true),
                "Rota {$rota->uri()} sem middleware 'organizacao' ou 'plataforma'",
            );
        }
    }
}
