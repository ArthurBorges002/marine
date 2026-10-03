<?php

namespace Tests\Feature;

use App\Models\Perfil;
use App\Models\Usuario;
use App\Support\Permissoes;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PermissoesTest extends TestCase
{
    use RefreshDatabase;

    private function entrarComo(string $perfil): Usuario
    {
        $usuario = Usuario::factory()->comPerfil($perfil)->create();
        Sanctum::actingAs($usuario);

        return $usuario;
    }

    public function test_perfil_consulta_le_mas_nao_altera(): void
    {
        $this->entrarComo('Consulta');

        $this->getJson('/api/funcionarios')->assertOk();
        $this->getJson('/api/financas')->assertOk();
        $this->postJson('/api/funcionarios', ['nome_completo' => 'X'])->assertForbidden();
        $this->getJson('/api/usuarios')->assertForbidden();
        $this->getJson('/api/auditorias')->assertForbidden();
        $this->putJson('/api/configuracoes-cadastro/1', ['config' => []])->assertForbidden();

        $this->getJson('/api/me')->assertOk()
            ->assertJsonPath('perfil.nome', 'Consulta')
            ->assertJsonFragment(['rh.funcionarios.ver'])
            ->assertJsonMissing(['rh.funcionarios.criar']);
    }

    public function test_perfil_rh_nao_ve_financeiro(): void
    {
        $this->entrarComo('RH');

        $this->postJson('/api/funcionarios', ['nome_completo' => 'Nova Pessoa'])->assertCreated();
        $this->getJson('/api/financas')->assertForbidden();
        $this->getJson('/api/equipamentos')->assertForbidden();
    }

    public function test_perfil_sem_permissoes_nao_acessa_nada(): void
    {
        $this->entrarComo('Funcionário');

        $this->getJson('/api/dashboard')->assertForbidden();
        $this->getJson('/api/funcionarios')->assertForbidden();
        $this->getJson('/api/me')->assertOk()->assertJsonPath('permissoes', []);
    }

    public function test_administrador_tem_todo_o_catalogo(): void
    {
        $usuario = $this->entrarComo('Administrador');

        $this->assertSame(Permissoes::chaves(), $usuario->permissoes());
        $this->getJson('/api/usuarios')->assertOk();
        $this->getJson('/api/auditorias')->assertOk();
    }

    public function test_mudanca_no_perfil_vale_na_hora(): void
    {
        $usuario = $this->entrarComo('Consulta');
        $this->getJson('/api/financas')->assertOk();

        Perfil::find($usuario->perfil_id)->sincronizarPermissoes(['rh.funcionarios.ver']);
        $this->app['auth']->forgetGuards();
        Sanctum::actingAs($usuario->fresh());

        $this->getJson('/api/financas')->assertForbidden();
    }

    public function test_usuario_inativo_nao_entra_nem_usa_token_antigo(): void
    {
        $usuario = Usuario::factory()->create(['email' => 'u@teste.com', 'password' => 'senha123']);
        $token = $this->postJson('/api/login', ['email' => 'u@teste.com', 'senha' => 'senha123'])->json('token');

        $usuario->update(['ativo' => false]);
        $this->app['auth']->forgetGuards();

        $this->withToken($token)->getJson('/api/dashboard')->assertForbidden();
        $this->postJson('/api/login', ['email' => 'u@teste.com', 'senha' => 'senha123'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Usuário desativado. Fale com o administrador da sua empresa.');
    }
}
