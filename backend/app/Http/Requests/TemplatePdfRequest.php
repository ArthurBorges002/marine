<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TemplatePdfRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'arquivo' => ['required', 'file', 'mimes:png,jpg,jpeg,webp', 'max:10240'],
            'nomeModelo' => ['required', 'string', 'max:120'],
            // "doc" é o valor que o frontend envia para templates de documento
            'tipo' => ['required', Rule::in(['capa', 'doc', 'documento'])],
        ];
    }

    public function attributes(): array
    {
        return ['nomeModelo' => 'nome do template'];
    }

    public function tipoTemplate(): string
    {
        return $this->input('tipo') === 'capa' ? 'capa' : 'documento';
    }
}
