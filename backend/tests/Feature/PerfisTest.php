<?php

namespace Tests\Feature;

use App\Models\Auditoria;
use App\Models\Perfil;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PerfisTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_perfis_padrao_e_catalogo(): void
    {
        $this->autenticar();

        $this->getJson('/api/perfis')->assertOk()
            ->assertJsonCount(6)
            ->assertJsonPath('0.nome', 'Administrador')
            ->assertJsonPath('0.administrador', true)
            ->assertJsonPath('0.usuarios', 1);

        $this->getJson('/api/perfis/catalogo')->assertOk()
            ->assertJsonFragment(['modulo' => 'RH'])
            ->assertJsonFragment(['chave' => 'admin.auditoria.ver']);
    }

    public function test_cria_e_edita_perfil_com_auditoria_das_permissoes(): void
    {
        $this->autenticar();

        $id = $this->postJson('/api/perfis', ['nome' => 'Compras', 'permissoes' => ['financeiro.ver']])
            ->assertCreated()->assertJsonPath('permissoes', ['financeiro.ver'])->json('id');

        $this->putJson("/api/perfis/$id", ['permissoes' => ['financeiro.ver', 'dashboard.ver']])->assertOk()
            ->assertJsonPath('permissoes', ['dashboard.ver', 'financeiro.ver']);

        $registro = Auditoria::where('auditavel_type', Perfil::class)->where('auditavel_id', $id)->where('acao', 'atualizado')->latest('id')->first();
        $this->assertSame(['permissoes' => ['financeiro.ver']], $registro->antes);
        $this->assertSame(['permissoes' => ['dashboard.ver', 'financeiro.ver']], $registro->depois);
    }

    public function test_valida_nome_repetido_e_permissao_desconhecida(): void
    {
        $this->autenticar();

        $this->postJson('/api/perfis', ['nome' => 'RH', 'permissoes' => ['nao.existe']])
            ->assertStatus(422)->assertJsonValidationErrors(['nome', 'permissoes.0']);
    }

    public function test_administrador_nao_pode_ser_alterado_nem_excluido(): void
    {
        $admin = $this->autenticar();

        $this->putJson("/api/perfis/{$admin->perfil_id}", ['permissoes' => []])->assertStatus(422);
        $this->deleteJson("/api/perfis/{$admin->perfil_id}")->assertStatus(422);
    }

    public function test_exclui_perfil_so_sem_usuarios(): void
    {
        $admin = $this->autenticar();
        $rh = $admin->organizacao->perfis()->where('nome', 'RH')->first();
        $consulta = $admin->organizacao->perfis()->where('nome', 'Consulta')->first();
        Usuario::factory()->comPerfil('RH')->create(['organizacao_id' => $admin->organizacao_id]);

        $this->deleteJson("/api/perfis/{$rh->id}")->assertStatus(422);
        $this->deleteJson("/api/perfis/{$consulta->id}")->assertOk();
        $this->assertDatabaseMissing('perfis', ['id' => $consulta->id]);
        $this->assertDatabaseMissing('perfil_permissoes', ['perfil_id' => $consulta->id]);
    }

    public function test_perfil_de_outra_organizacao_responde_404(): void
    {
        $this->autenticar();
        $deOutra = Usuario::factory()->create()->organizacao->perfis()->where('nome', 'RH')->first();

        $this->putJson("/api/perfis/{$deOutra->id}", ['nome' => 'Invadido'])->assertNotFound();
        $this->deleteJson("/api/perfis/{$deOutra->id}")->assertNotFound();
    }
}
