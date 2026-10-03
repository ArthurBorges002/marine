<?php

namespace Tests\Feature;

use App\Models\Funcionario;
use App\Models\Organizacao;
use App\Models\Usuario;
use App\Support\OrganizacaoAtual;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlataformaTest extends TestCase
{
    use RefreshDatabase;

    private function administradorPlataforma(): Usuario
    {
        $usuario = Usuario::factory()->plataforma()->create();
        Sanctum::actingAs($usuario);

        return $usuario;
    }

    private function novaOrganizacao(array $extra = []): array
    {
        return array_merge([
            'nome' => 'Cliente Um',
            'documento' => '12.345.678/0001-90',
            'administrador' => ['nome' => 'Ana', 'email' => 'ana@cliente.com', 'senha' => 'senha-forte-1'],
        ], $extra);
    }

    public function test_cria_organizacao_com_administrador_que_consegue_entrar(): void
    {
        $this->administradorPlataforma();

        $this->postJson('/api/plataforma/organizacoes', $this->novaOrganizacao())->assertCreated()
            ->assertJsonPath('nome', 'Cliente Um')
            ->assertJsonPath('documento', '12345678000190')
            ->assertJsonPath('status', 'ativa')
            ->assertJsonPath('usuarios', 1);

        $this->app['auth']->forgetGuards();
        $this->postJson('/api/login', ['email' => 'ana@cliente.com', 'senha' => 'senha-forte-1'])->assertOk()
            ->assertJsonPath('usuario.organizacao.nome', 'Cliente Um')
            ->assertJsonPath('usuario.administradorPlataforma', false)
            ->assertJsonPath('usuario.perfil.nome', 'Administrador');
    }

    public function test_valida_criacao(): void
    {
        $this->administradorPlataforma();
        Usuario::factory()->create(['email' => 'ana@cliente.com']);

        $this->postJson('/api/plataforma/organizacoes', $this->novaOrganizacao(['nome' => '', 'documento' => '123']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nome', 'documento', 'administrador.email']);
        $this->assertSame(1, Organizacao::count()); // só a do usuário criado acima
    }

    public function test_lista_e_suspende_organizacao(): void
    {
        $this->administradorPlataforma();
        $organizacao = Organizacao::factory()->create(['nome' => 'Beta', 'documento' => '12345678000190']);

        $this->getJson('/api/plataforma/organizacoes')->assertOk()->assertJsonPath('0.nome', 'Beta');
        $this->patchJson("/api/plataforma/organizacoes/{$organizacao->id}", ['status' => 'suspensa'])->assertOk()
            ->assertJsonPath('status', 'suspensa')
            ->assertJsonPath('documento', '12345678000190'); // PATCH parcial não apaga outros campos
        $this->patchJson("/api/plataforma/organizacoes/{$organizacao->id}", ['status' => 'excluida'])->assertStatus(422);
    }

    public function test_organizacao_suspensa_nao_entra_nem_usa_token_antigo(): void
    {
        $usuario = Usuario::factory()->create(['email' => 'u@cliente.com', 'password' => 'senha123']);
        $token = $this->postJson('/api/login', ['email' => 'u@cliente.com', 'senha' => 'senha123'])->assertOk()->json('token');

        $usuario->organizacao->update(['status' => 'suspensa']);

        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/funcionarios')->assertForbidden();
        $this->postJson('/api/login', ['email' => 'u@cliente.com', 'senha' => 'senha123'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Organização suspensa. Entre em contato com o suporte.');
    }

    public function test_usuario_de_organizacao_nao_acessa_plataforma(): void
    {
        $this->autenticar();

        $this->getJson('/api/plataforma/organizacoes')->assertForbidden();
        $this->postJson('/api/plataforma/organizacoes', $this->novaOrganizacao())->assertForbidden();
    }

    public function test_administrador_da_plataforma_nao_acessa_dados_de_negocio(): void
    {
        $this->administradorPlataforma();

        $this->getJson('/api/funcionarios')->assertForbidden();
        $this->getJson('/api/funcionarios/1')->assertForbidden();
        $this->getJson('/api/dashboard')->assertForbidden();
        $this->getJson('/api/me')->assertOk()
            ->assertJsonPath('administradorPlataforma', true)
            ->assertJsonPath('organizacao', null);
    }

    public function test_consulta_sem_organizacao_e_bloqueada_e_executar_como_restringe(): void
    {
        $a = Organizacao::factory()->create();
        $b = Organizacao::factory()->create();
        OrganizacaoAtual::executarComo($a, fn () => Funcionario::factory()->create(['nome' => 'Da A']));
        OrganizacaoAtual::executarComo($b, fn () => Funcionario::factory()->create(['nome' => 'Da B']));

        $this->assertSame(['Da A'], OrganizacaoAtual::executarComo($a, fn () => Funcionario::pluck('nome')->all()));

        $this->expectExceptionMessage('Acesso permitido apenas a usuários de uma organização.');
        Funcionario::count();
    }

    public function test_comando_cria_administrador_da_plataforma(): void
    {
        $this->artisan('integra:admin-plataforma', ['email' => 'dono@integra.com'])
            ->expectsQuestion('Senha (mínimo 8 caracteres)', 'senha-muito-forte')
            ->assertSuccessful();

        $usuario = Usuario::firstWhere('email', 'dono@integra.com');
        $this->assertTrue($usuario->isAdministradorPlataforma());

        $this->artisan('integra:admin-plataforma', ['email' => 'dono@integra.com'])
            ->expectsQuestion('Senha (mínimo 8 caracteres)', 'senha-muito-forte')
            ->assertFailed();
    }
}
