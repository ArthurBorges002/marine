<?php

namespace App\Services;

use App\Models\Orcamento;
use App\Models\Usuario;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class OrcamentoService
{
    /** Quantidade de orçamentos por página na listagem (scroll infinito). */
    public const POR_PAGINA = 4;

    /**
     * Listagem com os filtros da tela de orçamentos.
     *
     * @param  array{search?: ?string, status?: ?string, data_inicial?: ?string, data_final?: ?string}  $filtros
     */
    public function listar(array $filtros, int $pagina): Paginator
    {
        return Orcamento::query()
            ->when($filtros['search'] ?? null, function (Builder $q, string $busca) {
                $q->where(fn (Builder $q) => $q
                    ->whereLike('nome_cliente', "%{$busca}%")
                    ->orWhereLike('codigo_interno', "%{$busca}%")
                    ->orWhereLike('cidade', "%{$busca}%"));
            })
            ->when(
                in_array($filtros['status'] ?? null, Orcamento::STATUS, true),
                fn (Builder $q) => $q->where('status', $filtros['status'])
            )
            ->when(
                ($filtros['data_inicial'] ?? null) && ($filtros['data_final'] ?? null),
                fn (Builder $q) => $q
                    ->whereDate('created_at', '>=', $filtros['data_inicial'])
                    ->whereDate('created_at', '<=', $filtros['data_final'])
            )
            ->orderByDesc('id')
            ->simplePaginate(self::POR_PAGINA, page: max(1, $pagina));
    }

    /** Número exibido na tela de criação ("Orçamento Nº 0004"). */
    public function proximoNumero(): int
    {
        return (int) Orcamento::max('id') + 1;
    }

    public function criar(array $dados, Usuario $usuario): Orcamento
    {
        return DB::transaction(function () use ($dados, $usuario) {
            $orcamento = new Orcamento($dados + ['status' => 'E']);
            $orcamento->usuario_id = $usuario->id;
            $orcamento->ultimo_editor_id = $usuario->id;
            // Valor provisório único; o definitivo depende do id gerado pelo banco.
            $orcamento->codigo_interno = 'TMP-'.uniqid();
            $orcamento->save();

            $orcamento->codigo_interno = $this->gerarCodigoInterno($orcamento);
            $orcamento->save();

            return $orcamento;
        });
    }

    public function atualizar(Orcamento $orcamento, array $dados, Usuario $usuario): Orcamento
    {
        $orcamento->fill($dados);
        $orcamento->ultimo_editor_id = $usuario->id;
        $orcamento->save();

        return $orcamento;
    }

    public function alterarStatus(Orcamento $orcamento, string $status): Orcamento
    {
        $orcamento->update(['status' => $status]);

        return $orcamento;
    }

    /** Formato herdado do sistema anterior: ORC-AAAA-NNNN. */
    private function gerarCodigoInterno(Orcamento $orcamento): string
    {
        return sprintf('ORC-%s-%04d', $orcamento->created_at->format('Y'), $orcamento->id);
    }
}
