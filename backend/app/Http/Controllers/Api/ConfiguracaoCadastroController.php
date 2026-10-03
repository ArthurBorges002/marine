<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConfiguracaoCadastroRequest;
use App\Models\ConfiguracaoCadastro;
use Illuminate\Http\JsonResponse;

class ConfiguracaoCadastroController extends Controller
{
    public function show(int $tela): JsonResponse
    {
        $this->validarTela($tela);

        return response()->json(ConfiguracaoCadastro::daTela($tela));
    }

    public function update(ConfiguracaoCadastroRequest $request, int $tela): JsonResponse
    {
        $this->validarTela($tela);

        ConfiguracaoCadastro::updateOrCreate(['tela' => $tela], ['configuracao' => $request->validated('config')]);

        return response()->json(['status' => 'Certo']);
    }

    private function validarTela(int $tela): void
    {
        abort_unless(array_key_exists($tela, ConfiguracaoCadastro::PADRAO), 404);
    }
}
