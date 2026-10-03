<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_retorna_token_e_usuario(): void
    {
        Usuario::factory()->create(['email' => 'admin@teste.com', 'password' => 'segredo123', 'nome' => 'Admin']);

        $this->postJson('/api/login', ['email' => 'admin@teste.com', 'senha' => 'segredo123'])
            ->assertOk()
            ->assertJsonStructure(['token', 'usuario' => ['id', 'nome', 'email', 'perfil', 'permissoes']])
            ->assertJsonPath('usuario.perfil.nome', 'Administrador')
            ->assertJsonMissingPath('usuario.password');
    }

    public function test_login_com_senha_errada_falha(): void
    {
        Usuario::factory()->create(['email' => 'user@teste.com', 'password' => 'certa']);

        $this->postJson('/api/login', ['email' => 'user@teste.com', 'senha' => 'errada'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Email ou senha incorretos');
    }

    public function test_login_valida_campos(): void
    {
        $this->postJson('/api/login', [])->assertStatus(422)->assertJsonValidationErrors(['email', 'senha']);
    }

    public function test_rotas_protegidas_exigem_token(): void
    {
        foreach (['/api/me', '/api/dashboard', '/api/funcionarios', '/api/projetos', '/api/financas'] as $rota) {
            $this->getJson($rota)->assertUnauthorized();
        }
    }

    public function test_me_e_logout_revoga_token(): void
    {
        Usuario::factory()->create(['email' => 'u@teste.com', 'password' => 'senha123']);
        $token = $this->postJson('/api/login', ['email' => 'u@teste.com', 'senha' => 'senha123'])->json('token');

        $this->withToken($token)->getJson('/api/me')->assertOk()->assertJsonPath('email', 'u@teste.com');
        $this->withToken($token)->postJson('/api/logout')->assertOk();

        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }
}
