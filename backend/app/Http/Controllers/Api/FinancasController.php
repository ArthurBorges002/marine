<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContaPagarResource;
use App\Http\Resources\ContaReceberResource;
use App\Models\ContaPagar;
use App\Models\ContaReceber;
use App\Models\FluxoCaixa;
use Illuminate\Http\JsonResponse;

class FinancasController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'contasReceber' => ContaReceberResource::collection(
                ContaReceber::with('projeto')->orderBy('data_vencimento')->get()
            ),
            'contasPagar' => ContaPagarResource::collection(
                ContaPagar::orderBy('data_vencimento')->get()
            ),
            'fluxoCaixa' => $this->fluxoCaixa(),
        ]);
    }

    /** Totais mensais com saldo acumulado. */
    private function fluxoCaixa(): array
    {
        $saldo = 0.0;

        return FluxoCaixa::orderBy('mes')->get()->map(function (FluxoCaixa $mes) use (&$saldo) {
            $saldo += $mes->entradas - $mes->saidas;

            return [
                'data' => $mes->mes,
                'entradas' => $mes->entradas,
                'saidas' => $mes->saidas,
                'saldo' => $saldo,
            ];
        })->all();
    }
}
