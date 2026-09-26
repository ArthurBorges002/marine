<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfiguracaoCadastroRequest extends FormRequest
{
    public function rules(): array
    {
        $blocos = ['principal', 'endereco', 'contato', 'dadosProfissionais', 'documento', 'certificacoes'];

        $regras = ['config' => ['required', 'array']];
        foreach ($blocos as $bloco) {
            $regras["config.$bloco"] = ['required', 'array'];
            $regras["config.$bloco.*"] = ['boolean'];
        }

        return $regras;
    }
}
