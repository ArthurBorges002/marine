<?php

namespace App\Http\Requests;

use App\Support\RegrasOrganizacao;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Criação e edição de usuário da organização. */
class UsuarioRequest extends FormRequest
{
    public function rules(): array
    {
        $id = $this->route('usuario');
        $criando = $id === null;

        return [
            'nome' => [$criando ? 'required' : 'sometimes', 'string', 'max:255'],
            // Email é o login: único no sistema inteiro (não só na organização)
            'email' => [$criando ? 'required' : 'sometimes', 'email', 'max:255', Rule::unique('usuarios', 'email')->ignore($id)],
            'perfil_id' => [$criando ? 'required' : 'sometimes', 'integer', RegrasOrganizacao::existe('perfis')],
            'senha' => [$criando ? 'required' : 'nullable', 'string', 'min:8'],
            'ativo' => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return ['perfil_id' => 'perfil'];
    }
}
