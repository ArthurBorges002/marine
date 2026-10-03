<?php

namespace Tests\Feature;

use App\Models\Organizacao;
use App\Models\Perfil;
use App\Models\Usuario;
use App\Support\OrganizacaoAtual;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UsuariosTest extends TestCase
{
    use RefreshDatabase;

    private function perfilId(Usuario $usuario, string $nome): int
    {
        return $usuario->organizacao->perfis()->where('nome', $nome)->value('id');
    }

    public function test_lista_so_usuarios_da_propria_organizacao(): void
    {
        $admin = $this->autenticar(['nome' => 'Ana']);
        Usuario::factory()->create(['organizacao_id' => $admin->organizacao_id, 'nome' => 'Bia']);
        Usuario::factory()->create(['nome' => 'De outra empresa']);
        Usuario::factory()->plataforma()->create(['nome' => 'Dono do SaaS']);

        $this->getJson('/api/usuarios')->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.nome', 'Ana')
            ->assertJsonPath('1.nome', 'Bia');
    }

    public function test_cria_usuario_que_consegue_entrar(): void
    {
        $admin = $this->autenticar();

        $this->postJson('/api/usuarios', [
            'nome' => 'Carlos', 'email' => 'carlos@teste.com', 'senha' => 'senha-forte', 'perfil_id' => $this->perfilId($admin, 'RH'),
        ])->assertCreated()->assertJsonPath('perfil.nome', 'RH')->assertJsonPath('ativo', true);

        $this->app['auth']->forgetGuards();
        $this->postJson('/api/login', ['email' => 'carlos@teste.com', 'senha' => 'senha-forte'])->assertOk()
            ->assertJsonPath('usuario.organizacao.id', $admin->organizacao_id);
    }

    public function test_valida_perfil_de_outra_organizacao_e_email_repetido(): void
    {
        $this->autenticar();
        $outra = Organizacao::factory()->create();
        Usuario::factory()->create(['email' => 'existe@teste.com']);

        $this->postJson('/api/usuarios', [
            'nome' => 'X', 'email' => 'existe@teste.com', 'senha' => 'curta',
            'perfil_id' => $outra->perfis()->where('nome', 'RH')->value('id'),
        ])->assertStatus(422)->assertJsonValidationErrors(['email', 'senha', 'perfil_id']);
    }

    public function test_desativar_derruba_as_sessoes_do_usuario(): void
    {
        $admin = $this->autenticar();
        $outro = Usuario::factory()->create(['organizacao_id' => $admin->organizacao_id, 'email' => 'b@teste.com', 'password' => 'senha123']);
        $token = $outro->createToken('frontend')->plainTextToken;

        $this->putJson("/api/usuarios/{$outro->id}", ['ativo' => false])->assertOk()->assertJsonPath('ativo', false);

        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }

    public function test_nao_desativa_nem_troca_o_proprio_perfil(): void
    {
        $admin = $this->autenticar();

        $this->putJson("/api/usuarios/{$admin->id}", ['ativo' => false])->assertStatus(422)->assertJsonValidationErrors('ativo');
        $this->putJson("/api/usuarios/{$admin->id}", ['perfil_id' => $this->perfilId($admin, 'RH')])
            ->assertStatus(422)->assertJsonValidationErrors('perfil_id');
        $this->putJson("/api/usuarios/{$admin->id}", ['nome' => 'Novo nome'])->assertOk(); // o resto pode
    }

    public function test_organizacao_nunca_fica_sem_administrador_ativo(): void
    {
        $unicoAdmin = Usuario::factory()->create();
        $gestor = Usuario::factory()->comPerfil('Consulta')->create(['organizacao_id' => $unicoAdmin->organizacao_id]);
        // Perfil não administrador que pode editar usuários
        OrganizacaoAtual::executarComo($unicoAdmin->organizacao_id, function () use ($gestor) {
            $perfil = Perfil::create(['nome' => 'Gestor de acessos']);
            $perfil->sincronizarPermissoes(['admin.usuarios.ver', 'admin.usuarios.editar']);
            $gestor->forceFill(['perfil_id' => $perfil->id])->save();
        });
        Sanctum::actingAs($gestor->fresh());

        $this->putJson("/api/usuarios/{$unicoAdmin->id}", ['ativo' => false])
            ->assertStatus(422)->assertJsonPath('errors.perfil_id.0', 'A organização precisa de pelo menos um Administrador ativo.');
        $this->putJson("/api/usuarios/{$unicoAdmin->id}", ['perfil_id' => $this->perfilId($unicoAdmin, 'RH')])->assertStatus(422);

        // Com outro administrador ativo, pode
        Usuario::factory()->create(['organizacao_id' => $unicoAdmin->organizacao_id]);
        $this->putJson("/api/usuarios/{$unicoAdmin->id}", ['ativo' => false])->assertOk();
    }

    public function test_opcoes_de_perfil_para_quem_gerencia_usuarios(): void
    {
        $admin = Usuario::factory()->create();
        $gestor = Usuario::factory()->comPerfil('Consulta')->create(['organizacao_id' => $admin->organizacao_id]);
        OrganizacaoAtual::executarComo($admin->organizacao_id, function () use ($gestor) {
            $perfil = Perfil::create(['nome' => 'Gestor de acessos']);
            $perfil->sincronizarPermissoes(['admin.usuarios.ver']);
            $gestor->forceFill(['perfil_id' => $perfil->id])->save();
        });
        Sanctum::actingAs($gestor->fresh());

        $this->getJson('/api/perfis')->assertForbidden();
        $this->getJson('/api/usuarios/perfis')->assertOk()->assertJsonCount(7)->assertJsonPath('0.nome', 'Administrador');
    }

    public function test_usuario_de_outra_organizacao_responde_404(): void
    {
        $this->autenticar();
        $deOutra = Usuario::factory()->create();

        $this->putJson("/api/usuarios/{$deOutra->id}", ['nome' => 'Invadido'])->assertNotFound();
        $this->assertNotSame('Invadido', $deOutra->fresh()->nome);
    }
}
