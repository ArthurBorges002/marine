<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FuncionarioRequest;
use App\Http\Resources\FuncionarioDetalheResource;
use App\Http\Resources\FuncionarioResource;
use App\Models\Funcionario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FuncionarioController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return FuncionarioResource::collection(
            Funcionario::with('certificacoes')->orderBy('nome')->get()
        );
    }

    public function show(Funcionario $funcionario): FuncionarioDetalheResource
    {
        return new FuncionarioDetalheResource($funcionario);
    }

    public function store(FuncionarioRequest $request): JsonResponse
    {
        $funcionario = Funcionario::create($request->dadosFuncionario() + [
            'data_admissao' => today(),
            'status' => 'ativo',
        ]);

        return response()->json(['msg' => 'Sucesso', 'codigo' => $funcionario->id], 201);
    }

    public function update(FuncionarioRequest $request, Funcionario $funcionario): JsonResponse
    {
        $funcionario->update($request->dadosFuncionario());

        return response()->json(['msg' => 'Sucesso', 'codigo' => $funcionario->id]);
    }
}
