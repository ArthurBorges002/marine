<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AlterarSenhaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'senha_atual' => ['required', 'string', 'current_password:sanctum'],
            'nova_senha' => ['required', 'string', 'min:8', 'confirmed', 'different:senha_atual'],
        ];
    }

    public function attributes(): array
    {
        return [
            'senha_atual' => 'senha atual',
            'nova_senha' => 'nova senha',
        ];
    }

    public function messages(): array
    {
        return [
            'senha_atual.current_password' => 'A senha atual não confere.',
            'nova_senha.different' => 'A nova senha precisa ser diferente da atual.',
        ];
    }
}
