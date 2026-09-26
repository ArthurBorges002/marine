<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModeloOrcamentoRequest;
use App\Models\ModeloOrcamento;
use Illuminate\Http\JsonResponse;

class ModeloOrcamentoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            ModeloOrcamento::orderBy('id')->get(['id', 'nome'])
                ->map(fn (ModeloOrcamento $m) => ['codigo' => (string) $m->id, 'nome' => $m->nome])
        );
    }

    public function show(ModeloOrcamento $modelo): JsonResponse
    {
        return response()->json([
            'codigo' => (string) $modelo->id,
            'nome' => $modelo->nome,
            'cabecalho' => $modelo->cabecalho,
            'corpo' => $modelo->corpo,
            'rodape' => $modelo->rodape,
        ]);
    }

    public function store(ModeloOrcamentoRequest $request): JsonResponse
    {
        $modelo = ModeloOrcamento::create($request->validated() + [
            'criado_por_id' => $request->user()->id,
            'atualizado_por_id' => $request->user()->id,
        ]);

        return response()->json(['status' => 'Certo', 'codigo' => $modelo->id], 201);
    }

    public function update(ModeloOrcamentoRequest $request, ModeloOrcamento $modelo): JsonResponse
    {
        $modelo->update($request->validated() + ['atualizado_por_id' => $request->user()->id]);

        return response()->json(['status' => 'Certo']);
    }
}
