<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrcamentoRequest;
use App\Http\Requests\OrcamentoStatusRequest;
use App\Http\Resources\OrcamentoDetalheResource;
use App\Http\Resources\OrcamentoResource;
use App\Models\Orcamento;
use App\Services\OrcamentoService;
use App\Services\PdfService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OrcamentoController extends Controller
{
    public function __construct(private OrcamentoService $orcamentos) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'data_inicial' => ['nullable', 'date'],
            'data_final' => ['nullable', 'date'],
        ]);

        $pagina = $this->orcamentos->listar(
            $request->only(['search', 'status', 'data_inicial', 'data_final']),
            (int) $request->input('page', 1),
        );

        return response()->json([
            'data' => OrcamentoResource::collection($pagina->items()),
            'hasMore' => $pagina->hasMorePages(),
        ]);
    }

    public function proximoNumero(): JsonResponse
    {
        return response()->json($this->orcamentos->proximoNumero());
    }

    public function show(Orcamento $orcamento): OrcamentoDetalheResource
    {
        return new OrcamentoDetalheResource($orcamento->load('modeloCapa'));
    }

    public function store(OrcamentoRequest $request): JsonResponse
    {
        $orcamento = $this->orcamentos->criar($request->dadosOrcamento(), $request->user());

        return response()->json([
            'status' => 'Certo',
            'codigo' => $orcamento->id,
            'codigo_interno' => $orcamento->codigo_interno,
        ], 201);
    }

    public function update(OrcamentoRequest $request, Orcamento $orcamento): JsonResponse
    {
        $this->orcamentos->atualizar($orcamento, $request->dadosOrcamento(), $request->user());

        return response()->json(['status' => 'Certo']);
    }

    public function alterarStatus(OrcamentoStatusRequest $request, Orcamento $orcamento): JsonResponse
    {
        $this->orcamentos->alterarStatus($orcamento, $request->validated('status'));

        return response()->json(['status' => 'Certo']);
    }

    public function destroy(Orcamento $orcamento): JsonResponse
    {
        $orcamento->delete();

        return response()->json(['status' => 'Certo']);
    }

    /** PDF de um orçamento salvo. */
    public function pdf(Orcamento $orcamento, PdfService $pdf): Response
    {
        $conteudo = $pdf->documento([
            'capa' => $orcamento->capa,
            'cabecalho' => $orcamento->cabecalho,
            'corpo' => $orcamento->corpo,
            'rodape' => $orcamento->rodape,
            'template_capa' => $orcamento->template_capa,
            'template_documento' => $orcamento->template_documento,
            'marca_dagua_capa' => $orcamento->marca_dagua_capa,
            'marca_dagua_documento' => $orcamento->marca_dagua_documento,
        ]);

        return PdfController::respostaPdf($conteudo, "{$orcamento->codigo_interno}.pdf");
    }
}
