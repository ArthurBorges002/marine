<?php

namespace App\Services;

use App\Models\ContaPagar;
use App\Models\ContaReceber;
use App\Models\Equipamento;
use App\Models\Funcionario;
use App\Models\Projeto;

class DashboardService
{
    /** Janela (em dias) para alertas de manutenção de equipamentos. */
    public const DIAS_ALERTA_MANUTENCAO = 15;

    /** Janela (em dias) para alertas de exame médico de funcionários. */
    public const DIAS_ALERTA_EXAME = 30;

    public function estatisticas(): array
    {
        $totalReceitas = (float) ContaReceber::sum('valor');
        $totalDespesas = (float) ContaPagar::sum('valor');

        return [
            'totalProjetos' => Projeto::count(),
            'projetosAtivos' => Projeto::where('status', 'em_andamento')->count(),
            'equipamentosDisponiveis' => (int) Equipamento::where('status', 'disponivel')->sum('quantidade'),
            'equipamentosManutencao' => Equipamento::where('status', 'manutencao')->count(),
            'funcionariosAtivos' => Funcionario::where('status', 'ativo')->count(),
            'totalReceitas' => $totalReceitas,
            'totalDespesas' => $totalDespesas,
            'saldoAtual' => $totalReceitas - $totalDespesas,
            'contasVencidas' => ContaReceber::where('status', 'vencido')->count(),
        ];
    }

    public function alertas(): array
    {
        $hoje = today();

        return [
            'valorContasVencidas' => (float) ContaReceber::where('status', 'vencido')->sum('valor'),
            'manutencoesProximas' => Equipamento::whereBetween('proxima_manutencao', [
                $hoje->copy()->addDay(), $hoje->copy()->addDays(self::DIAS_ALERTA_MANUTENCAO),
            ])->count(),
            'examesProximos' => Funcionario::where('status', 'ativo')->whereBetween('proximo_exame', [
                $hoje->copy()->addDay(), $hoje->copy()->addDays(self::DIAS_ALERTA_EXAME),
            ])->count(),
            'diasAlertaManutencao' => self::DIAS_ALERTA_MANUTENCAO,
            'diasAlertaExame' => self::DIAS_ALERTA_EXAME,
        ];
    }
}
