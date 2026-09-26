<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModeloCapaRequest;
use App\Models\ModeloCapa;
use Illuminate\Http\JsonResponse;

class ModeloCapaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            ModeloCapa::orderBy('id')->get(['id', 'nome'])
                ->map(fn (ModeloCapa $m) => ['codigo' => (string) $m->id, 'nome' => $m->nome])
        );
    }

    public function show(ModeloCapa $modelo): JsonResponse
    {
        return response()->json([
            'codigo' => (string) $modelo->id,
            'nome' => $modelo->nome,
            'capa' => $modelo->conteudo,
        ]);
    }

    public function store(ModeloCapaRequest $request): JsonResponse
    {
        $modelo = ModeloCapa::create([
            'nome' => $request->validated('nome'),
            'conteudo' => $request->validated('capa'),
            'criado_por_id' => $request->user()->id,
            'atualizado_por_id' => $request->user()->id,
        ]);

        return response()->json(['status' => 'Certo', 'codigo' => $modelo->id], 201);
    }

    public function update(ModeloCapaRequest $request, ModeloCapa $modelo): JsonResponse
    {
        $modelo->update([
            'nome' => $request->validated('nome'),
            'conteudo' => $request->validated('capa'),
            'atualizado_por_id' => $request->user()->id,
        ]);

        return response()->json(['status' => 'Certo']);
    }
}
