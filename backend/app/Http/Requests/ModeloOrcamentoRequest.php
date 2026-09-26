<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModeloOrcamentoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'cabecalho' => ['nullable', 'string'],
            'corpo' => ['nullable', 'string'],
            'rodape' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return ['nome' => 'nome do modelo'];
    }
}
