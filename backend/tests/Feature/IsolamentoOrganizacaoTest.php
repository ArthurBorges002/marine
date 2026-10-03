<?php

namespace Tests\Feature;

use App\Models\ConfiguracaoCadastro;
use App\Models\ContaPagar;
use App\Models\ContaReceber;
use App\Models\Equipamento;
use App\Models\FluxoCaixa;
use App\Models\Funcionario;
use App\Models\FuncionarioCertificacao;
use App\Models\Projeto;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Um cliente nunca vê nem altera dados de outro. Todo endpoint de negócio novo
 * deve ganhar um caso aqui (docs/CONVENCOES.md).
 */
class IsolamentoOrganizacaoTest extends TestCase
{
    use RefreshDatabase;

    private Funcionario $funcionarioA;

    /** Cria dados na organização A e autentica um usuário da organização B. */
    private function dadosNaOrganizacaoAeUsuarioDaB(): Usuario
    {
        $this->autenticar();
        $this->funcionarioA = Funcionario::factory()->create(['nome' => 'Da A', 'cpf' => '111.222.333-44', 'proximo_exame' => today()->addDays(5)]);
        FuncionarioCertificacao::create(['funcionario_id' => $this->funcionarioA->id, 'nome' => 'Cert A']);
        $projeto = Projeto::create(['nome' => 'Projeto A', 'cliente' => 'C', 'local' => 'L', 'data_inicio' => '2026-01-01', 'status' => 'em_andamento']);
        Equipamento::create(['nome' => 'Eq A', 'tipo' => 'T', 'marca' => 'M', 'modelo' => 'M', 'numero_serie' => 'SERIE-1', 'status' => 'manutencao']);
        ContaReceber::create(['cliente' => 'C', 'valor' => 100, 'data_vencimento' => '2026-01-10', 'status' => 'vencido', 'descricao' => 'R', 'projeto_id' => $projeto->id]);
        ContaPagar::create(['fornecedor' => 'F', 'valor' => 50, 'data_vencimento' => '2026-01-10', 'status' => 'pendente', 'descricao' => 'P', 'categoria' => 'X']);
        FluxoCaixa::create(['mes' => '2026-01', 'entradas' => 100, 'saidas' => 50]);
        $config = ConfiguracaoCadastro::PADRAO[ConfiguracaoCadastro::TELA_FUNCIONARIO];
        $config['principal']['cpf'] = false;
        $this->putJson('/api/configuracoes-cadastro/1', ['config' => $config])->assertOk();

        $usuarioB = Usuario::factory()->create();
        Sanctum::actingAs($usuarioB);

        return $usuarioB;
    }

    public function test_listagens_nao_mostram_dados_de_outra_organizacao(): void
    {
        $this->dadosNaOrganizacaoAeUsuarioDaB();

        $this->getJson('/api/funcionarios')->assertOk()->assertJsonCount(0);
        $this->getJson('/api/projetos')->assertOk()->assertJsonCount(0);
        $this->getJson('/api/equipamentos')->assertOk()->assertJsonCount(0);
        $this->getJson('/api/financas')->assertOk()
            ->assertJsonCount(0, 'contasReceber')
            ->assertJsonCount(0, 'contasPagar')
            ->assertJsonCount(0, 'fluxoCaixa');
        $this->assertSame(0, FuncionarioCertificacao::count());
    }

    public function test_dashboard_so_conta_a_propria_organizacao(): void
    {
        $this->dadosNaOrganizacaoAeUsuarioDaB();

        $this->getJson('/api/dashboard')->assertOk()
            ->assertJsonPath('estatisticas.totalProjetos', 0)
            ->assertJsonPath('estatisticas.funcionariosAtivos', 0)
            ->assertJsonPath('estatisticas.equipamentosManutencao', 0)
            ->assertJsonPath('estatisticas.totalReceitas', 0)
            ->assertJsonPath('alertas.examesProximos', 0)
            ->assertJsonCount(0, 'projetos');
    }

    public function test_registro_de_outra_organizacao_responde_404(): void
    {
        $this->dadosNaOrganizacaoAeUsuarioDaB();
        $id = $this->funcionarioA->id;

        $this->getJson("/api/funcionarios/$id")->assertNotFound();
        $this->putJson("/api/funcionarios/$id", ['nome_completo' => 'Invadido'])->assertNotFound();
        $this->assertDatabaseHas('funcionarios', ['id' => $id, 'nome' => 'Da A']);
    }

    public function test_configuracao_de_cadastro_e_por_organizacao(): void
    {
        $this->dadosNaOrganizacaoAeUsuarioDaB();

        $this->getJson('/api/configuracoes-cadastro/1')->assertOk()->assertJsonPath('principal.cpf', true);
    }

    public function test_mesmo_cpf_e_numero_de_serie_em_organizacoes_diferentes(): void
    {
        $usuarioB = $this->dadosNaOrganizacaoAeUsuarioDaB();

        $id = $this->postJson('/api/funcionarios', ['nome_completo' => 'Da B', 'cpf' => '111.222.333-44'])->assertCreated()->json('codigo');
        $this->assertDatabaseHas('funcionarios', ['id' => $id, 'organizacao_id' => $usuarioB->organizacao_id]);

        Equipamento::create(['nome' => 'Eq B', 'tipo' => 'T', 'marca' => 'M', 'modelo' => 'M', 'numero_serie' => 'SERIE-1']);
        $this->assertSame(2, Equipamento::withoutGlobalScope('organizacao')->count());
    }
}
