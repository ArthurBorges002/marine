<?php

namespace App\Http\Requests;

use App\Support\Permissoes;
use App\Support\RegrasOrganizacao;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PerfilRequest extends FormRequest
{
    public function rules(): array
    {
        $perfil = $this->route('perfil');
        $criando = $perfil === null;

        return [
            'nome' => [$criando ? 'required' : 'sometimes', 'string', 'max:60', RegrasOrganizacao::unico('perfis', 'nome')->ignore($perfil)],
            'descricao' => ['nullable', 'string', 'max:255'],
            'permissoes' => [$criando ? 'present' : 'sometimes', 'array'],
            'permissoes.*' => ['string', Rule::in(Permissoes::chaves())],
        ];
    }

    public function messages(): array
    {
        return ['permissoes.*.in' => 'Permissão desconhecida: :input.'];
    }
}
