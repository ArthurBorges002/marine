<?php

namespace Tests\Feature;

use App\Models\Auditoria;
use App\Models\Funcionario;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuditoriaTest extends TestCase
{
    use RefreshDatabase;

    public function test_registra_criacao_e_so_os_campos_alterados(): void
    {
        $admin = $this->autenticar();

        $id = $this->postJson('/api/funcionarios', ['nome_completo' => 'Ana', 'email' => 'ana@teste.com'])->json('codigo');
        $this->putJson("/api/funcionarios/$id", ['nome_completo' => 'Ana Lima', 'email' => 'ana@teste.com'])->assertOk();

        $criado = Auditoria::where('auditavel_id', $id)->where('auditavel_type', Funcionario::class)->where('acao', 'criado')->first();
        $this->assertSame($admin->id, $criado->usuario_id);
        $this->assertSame($admin->organizacao_id, $criado->organizacao_id);
        $this->assertSame('Ana', $criado->depois['nome']);

        $atualizado = Auditoria::where('auditavel_id', $id)->where('acao', 'atualizado')->first();
        $this->assertSame(['nome' => 'Ana'], $atualizado->antes);
        $this->assertSame(['nome' => 'Ana Lima'], $atualizado->depois);
    }

    public function test_senha_nunca_vai_para_a_auditoria(): void
    {
        $admin = $this->autenticar();
        $this->postJson('/api/usuarios', [
            'nome' => 'B', 'email' => 'b@teste.com', 'senha' => 'segredo-123',
            'perfil_id' => $admin->perfil_id,
        ])->assertCreated();

        $this->assertStringNotContainsString('segredo', Auditoria::all()->toJson());
        $this->assertStringNotContainsString('"password"', Auditoria::all()->toJson());
    }

    public function test_registra_login_e_tentativa_falha(): void
    {
        $usuario = Usuario::factory()->create(['email' => 'u@teste.com', 'password' => 'certa123']);

        $this->postJson('/api/login', ['email' => 'u@teste.com', 'senha' => 'errada'])->assertStatus(422);
        $this->postJson('/api/login', ['email' => 'u@teste.com', 'senha' => 'certa123'])->assertOk();
        $this->postJson('/api/login', ['email' => 'nao-existe@teste.com', 'senha' => 'x'])->assertStatus(422);

        $acoes = Auditoria::whereIn('acao', ['login', 'login_falhou'])->orderBy('id')->get();
        $this->assertSame(['login_falhou', 'login'], $acoes->pluck('acao')->all());
        $this->assertSame([$usuario->organizacao_id], $acoes->pluck('organizacao_id')->unique()->values()->all());
        $this->assertNotNull($usuario->fresh()->ultimo_acesso_em);
    }

    public function test_consulta_filtra_e_nao_mostra_outra_organizacao(): void
    {
        $admin = $this->autenticar();
        $this->postJson('/api/funcionarios', ['nome_completo' => 'Da minha empresa'])->assertCreated();

        $outro = Usuario::factory()->create();
        Sanctum::actingAs($outro);
        $this->postJson('/api/funcionarios', ['nome_completo' => 'De outra empresa'])->assertCreated();
        Sanctum::actingAs($admin);

        $resposta = $this->getJson('/api/auditorias?entidade=funcionario&acao=criado')->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('data.0.entidadeNome', 'Funcionário')
            ->assertJsonPath('data.0.usuario.id', $admin->id);
        $this->assertSame('Da minha empresa', $resposta->json('data.0.depois.nome'));

        $this->getJson('/api/auditorias?entidade=inexistente')->assertStatus(422);
    }
}
