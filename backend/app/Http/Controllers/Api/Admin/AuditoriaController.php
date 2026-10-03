<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditoriaResource;
use App\Models\Auditoria;
use App\Support\OrganizacaoAtual;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** Consulta da auditoria da organização (somente leitura). */
class AuditoriaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filtros = $request->validate([
            'acao' => ['nullable', Rule::in(Auditoria::ACOES)],
            'entidade' => ['nullable', Rule::in(array_keys(AuditoriaResource::ENTIDADES))],
            'usuario_id' => ['nullable', 'integer'],
            'de' => ['nullable', 'date'],
            'ate' => ['nullable', 'date', 'after_or_equal:de'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $pagina = Auditoria::query()
            ->where('organizacao_id', OrganizacaoAtual::id()) // sem escopo global: filtro explícito
            ->with('usuario:id,nome')
            ->when($filtros['acao'] ?? null, fn ($q, $acao) => $q->where('acao', $acao))
            ->when($filtros['entidade'] ?? null, fn ($q, $e) => $q->where('auditavel_type', AuditoriaResource::ENTIDADES[$e]['classe']))
            ->when($filtros['usuario_id'] ?? null, fn ($q, $id) => $q->where('usuario_id', $id))
            ->when($filtros['de'] ?? null, fn ($q, $de) => $q->whereDate('created_at', '>=', $de))
            ->when($filtros['ate'] ?? null, fn ($q, $ate) => $q->whereDate('created_at', '<=', $ate))
            ->orderByDesc('id')
            ->paginate(25);

        return response()->json([
            'data' => AuditoriaResource::collection($pagina->items()),
            'pagina' => $pagina->currentPage(),
            'ultimaPagina' => $pagina->lastPage(),
            'total' => $pagina->total(),
        ]);
    }
}
