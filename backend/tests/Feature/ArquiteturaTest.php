<?php

namespace Tests\Feature;

use App\Http\Resources\AuditoriaResource;
use App\Models\Auditoria;
use App\Models\Concerns\Auditavel;
use App\Models\Concerns\PertenceAOrganizacao;
use App\Models\Organizacao;
use App\Models\Usuario;
use App\Support\Permissoes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/** Regras do SaaS que valem para todo código novo: falham se alguém esquecer isolamento, permissão ou auditoria. */
class ArquiteturaTest extends TestCase
{
    use RefreshDatabase;

    /** Models que não pertencem a uma organização (justificativa no próprio model). */
    private const MODELS_FORA_DO_ISOLAMENTO = [Organizacao::class, Usuario::class, Auditoria::class];

    /** Models que não são auditados (a própria auditoria). */
    private const MODELS_NAO_AUDITADOS = [Auditoria::class];

    /** Rotas da API de qualquer usuário autenticado (ou públicas): sem organização nem permissão. */
    private const ROTAS_LIVRES = ['api/login', 'api/me', 'api/me/senha', 'api/logout'];

    /** @return list<class-string<Model>> */
    private function models(): array
    {
        return collect(glob(app_path('Models/*.php')))
            ->map(fn (string $arquivo) => 'App\\Models\\'.basename($arquivo, '.php'))
            ->filter(fn (string $classe) => is_subclass_of($classe, Model::class))
            ->values()
            ->all();
    }

    public function test_todo_model_de_negocio_usa_pertence_a_organizacao(): void
    {
        foreach (array_diff($this->models(), self::MODELS_FORA_DO_ISOLAMENTO) as $classe) {
            $this->assertContains(PertenceAOrganizacao::class, class_uses_recursive($classe), "$classe não usa PertenceAOrganizacao");
            $this->assertTrue(
                Schema::hasColumn((new $classe)->getTable(), 'organizacao_id'),
                "Tabela de $classe não tem organizacao_id",
            );
        }
    }

    public function test_todo_model_e_auditado_e_aparece_na_tela_de_auditoria(): void
    {
        $classesNaTela = array_column(AuditoriaResource::ENTIDADES, 'classe');

        foreach (array_diff($this->models(), self::MODELS_NAO_AUDITADOS) as $classe) {
            $this->assertContains(Auditavel::class, class_uses_recursive($classe), "$classe não usa Auditavel");
            $this->assertContains($classe, $classesNaTela, "$classe não está em AuditoriaResource::ENTIDADES");
        }
    }

    public function test_toda_rota_de_negocio_exige_organizacao_ou_plataforma(): void
    {
        foreach ($this->rotasDaApi() as $rota) {
            $middlewares = $rota->gatherMiddleware();
            $this->assertTrue(
                in_array('organizacao', $middlewares, true) || in_array('plataforma', $middlewares, true),
                "Rota {$rota->uri()} sem middleware 'organizacao' ou 'plataforma'",
            );
        }
    }

    public function test_toda_rota_de_organizacao_exige_uma_permissao_do_catalogo(): void
    {
        foreach ($this->rotasDaApi() as $rota) {
            $middlewares = $rota->gatherMiddleware();
            if (! in_array('organizacao', $middlewares, true)) {
                continue;
            }

            $permissoes = collect($middlewares)
                ->filter(fn ($m) => is_string($m) && str_starts_with($m, 'can:'))
                ->map(fn (string $m) => substr($m, 4));

            $this->assertNotEmpty($permissoes, "Rota {$rota->methods()[0]} {$rota->uri()} sem middleware can:");
            foreach ($permissoes as $permissao) {
                $this->assertTrue(Permissoes::existe($permissao), "Permissão '$permissao' da rota {$rota->uri()} não está no catálogo");
            }
        }
    }

    private function rotasDaApi(): array
    {
        return collect(Route::getRoutes()->getRoutes())
            ->filter(fn ($rota) => str_starts_with($rota->uri(), 'api/') && ! in_array($rota->uri(), self::ROTAS_LIVRES, true))
            ->all();
    }
}
