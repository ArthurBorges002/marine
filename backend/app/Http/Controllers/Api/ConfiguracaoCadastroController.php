<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConfiguracaoCadastroRequest;
use App\Models\ConfiguracaoCadastro;
use Illuminate\Http\JsonResponse;

class ConfiguracaoCadastroController extends Controller
{
    public function show(ConfiguracaoCadastro $configuracao): JsonResponse
    {
        return response()->json($configuracao->configuracao);
    }

    public function update(ConfiguracaoCadastroRequest $request, ConfiguracaoCadastro $configuracao): JsonResponse
    {
        $configuracao->update(['configuracao' => $request->validated('config')]);

        return response()->json(['status' => 'Certo']);
    }
}
