<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModeloCapaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'capa' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return ['nome' => 'nome do modelo de capa'];
    }
}
