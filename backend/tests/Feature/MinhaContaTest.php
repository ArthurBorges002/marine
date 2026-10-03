<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MinhaContaTest extends TestCase
{
    use RefreshDatabase;

    private function entrar(Usuario $usuario, string $senha): string
    {
        return $this->postJson('/api/login', ['email' => $usuario->email, 'senha' => $senha])->json('token');
    }

    public function test_troca_senha_e_encerra_as_outras_sessoes(): void
    {
        $usuario = Usuario::factory()->create(['password' => 'senha-antiga']);
        $outraSessao = $this->entrar($usuario, 'senha-antiga');
        $sessaoAtual = $this->entrar($usuario, 'senha-antiga');

        $this->withToken($sessaoAtual)->putJson('/api/me/senha', [
            'senha_atual' => 'senha-antiga', 'nova_senha' => 'senha-nova-1', 'nova_senha_confirmation' => 'senha-nova-1',
        ])->assertOk();

        $this->app['auth']->forgetGuards();
        $this->withToken($sessaoAtual)->getJson('/api/me')->assertOk();
        $this->app['auth']->forgetGuards();
        $this->withToken($outraSessao)->getJson('/api/me')->assertUnauthorized();
        $this->postJson('/api/login', ['email' => $usuario->email, 'senha' => 'senha-nova-1'])->assertOk();
    }

    public function test_valida_senha_atual_e_confirmacao(): void
    {
        $usuario = Usuario::factory()->create(['password' => 'senha-antiga']);
        $token = $this->entrar($usuario, 'senha-antiga');

        $this->withToken($token)->putJson('/api/me/senha', [
            'senha_atual' => 'errada', 'nova_senha' => 'curta', 'nova_senha_confirmation' => 'outra',
        ])->assertStatus(422)->assertJsonValidationErrors(['senha_atual', 'nova_senha']);
    }

    public function test_administrador_da_plataforma_tambem_troca_a_senha(): void
    {
        $dono = Usuario::factory()->plataforma()->create(['password' => 'senha-antiga']);
        $token = $this->entrar($dono, 'senha-antiga');

        $this->withToken($token)->putJson('/api/me/senha', [
            'senha_atual' => 'senha-antiga', 'nova_senha' => 'senha-nova-1', 'nova_senha_confirmation' => 'senha-nova-1',
        ])->assertOk();
    }
}
