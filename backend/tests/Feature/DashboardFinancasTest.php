<?php

namespace Tests\Feature;

use App\Models\ContaPagar;
use App\Models\ContaReceber;
use App\Models\Equipamento;
use App\Models\FluxoCaixa;
use App\Models\Funcionario;
use App\Models\Projeto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardFinancasTest extends TestCase
{
    use RefreshDatabase;

    private function criarDados(): void
    {
        $marina = Funcionario::factory()->create(['nome' => 'Marina', 'proximo_exame' => today()->addDays(10)]);
        Funcionario::factory()->create(['status' => 'inativo']);
        $projeto = Projeto::create([
            'nome' => 'Pier', 'cliente' => 'Porto', 'local' => 'Santos/SP', 'data_inicio' => '2024-02-01',
            'status' => 'em_andamento', 'progresso' => 65, 'orcamento' => 85000, 'gasto_real' => 52000, 'responsavel_id' => $marina->id,
        ]);
        Equipamento::create(['nome' => 'Cilindro', 'tipo' => 'R', 'marca' => 'L', 'modelo' => 'M', 'numero_serie' => 'S1', 'quantidade' => 15, 'status' => 'disponivel', 'proxima_manutencao' => today()->addDays(5)]);
        Equipamento::create(['nome' => 'Regulador', 'tipo' => 'R', 'marca' => 'S', 'modelo' => 'M', 'numero_serie' => 'S2', 'quantidade' => 8, 'status' => 'em_uso', 'projeto_id' => $projeto->id]);
        Equipamento::create(['nome' => 'Solda', 'tipo' => 'F', 'marca' => 'B', 'modelo' => 'M', 'numero_serie' => 'S3', 'quantidade' => 2, 'status' => 'manutencao']);
        ContaReceber::create(['cliente' => 'Porto', 'valor' => 25000, 'data_vencimento' => '2024-04-15', 'status' => 'pendente', 'descricao' => 'P1', 'projeto_id' => $projeto->id]);
        ContaReceber::create(['cliente' => 'Vale', 'valor' => 15000, 'data_vencimento' => '2024-02-20', 'status' => 'vencido', 'descricao' => 'Sinal']);
        ContaPagar::create(['fornecedor' => 'Luxfer', 'valor' => 8500, 'data_vencimento' => '2024-04-10', 'status' => 'pendente', 'descricao' => 'Manut.', 'categoria' => 'Equipamentos']);
        FluxoCaixa::create(['mes' => '2024-02', 'entradas' => 95000, 'saidas' => 72000]);
        FluxoCaixa::create(['mes' => '2024-01', 'entradas' => 120000, 'saidas' => 85000]);
    }

    public function test_dashboard_calcula_estatisticas_e_alertas(): void
    {
        $this->autenticar();
        $this->criarDados();

        $this->getJson('/api/dashboard')->assertOk()
            ->assertJsonPath('estatisticas', [
                'totalProjetos' => 1, 'projetosAtivos' => 1, 'equipamentosDisponiveis' => 15, 'equipamentosManutencao' => 1,
                'funcionariosAtivos' => 1, 'totalReceitas' => 40000, 'totalDespesas' => 8500, 'saldoAtual' => 31500, 'contasVencidas' => 1,
            ])
            ->assertJsonPath('alertas.valorContasVencidas', 15000)
            ->assertJsonPath('alertas.manutencoesProximas', 1)
            ->assertJsonPath('alertas.examesProximos', 1)
            ->assertJsonPath('projetos.0.responsavel', 'Marina');
    }

    public function test_financas_com_saldo_acumulado(): void
    {
        $this->autenticar();
        $this->criarDados();

        $this->getJson('/api/financas')->assertOk()
            ->assertJsonPath('fluxoCaixa', [
                ['data' => '2024-01', 'entradas' => 120000, 'saidas' => 85000, 'saldo' => 35000],
                ['data' => '2024-02', 'entradas' => 95000, 'saidas' => 72000, 'saldo' => 58000],
            ])
            ->assertJsonPath('contasReceber.1.projeto', 'Pier')
            ->assertJsonPath('contasPagar.0.categoria', 'Equipamentos');
    }

    public function test_equipamentos_e_projetos(): void
    {
        $this->autenticar();
        $this->criarDados();

        $this->getJson('/api/equipamentos')->assertOk()->assertJsonCount(3)
            ->assertJsonPath('1.projetoAtual', 'Pier')
            ->assertJsonPath('0.numeroSerie', 'S1');
        $this->getJson('/api/projetos')->assertOk()
            ->assertJsonPath('0.gastoReal', 52000)
            ->assertJsonPath('0.dataInicio', '2024-02-01');
    }
}
