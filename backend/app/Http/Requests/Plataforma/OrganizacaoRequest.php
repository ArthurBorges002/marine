<?php

namespace App\Http\Requests\Plataforma;

use App\Models\Organizacao;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Criação (com o primeiro administrador) e edição de organização. */
class OrganizacaoRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        // Só normaliza se veio: num PATCH de status o documento não pode ser apagado
        if ($this->has('documento')) {
            $documento = preg_replace('/\D/', '', (string) $this->input('documento'));
            $this->merge(['documento' => $documento === '' ? null : $documento]);
        }
    }

    public function rules(): array
    {
        $organizacao = $this->route('organizacao');
        $criando = $organizacao === null;

        return [
            'nome' => [$criando ? 'required' : 'sometimes', 'string', 'max:255'],
            'documento' => ['nullable', 'digits_between:11,14', Rule::unique('organizacoes', 'documento')->ignore($organizacao)],
            'plano' => ['nullable', 'string', 'max:40'],
            'status' => [$criando ? 'prohibited' : 'sometimes', Rule::in(Organizacao::STATUS)],

            'administrador.nome' => [$criando ? 'required' : 'prohibited', 'string', 'max:255'],
            'administrador.email' => [$criando ? 'required' : 'prohibited', 'email', 'max:255', 'unique:usuarios,email'],
            'administrador.senha' => [$criando ? 'required' : 'prohibited', 'string', 'min:8'],
        ];
    }

    public function attributes(): array
    {
        return [
            'documento' => 'CPF/CNPJ',
            'administrador.nome' => 'nome do administrador',
            'administrador.email' => 'email do administrador',
            'administrador.senha' => 'senha do administrador',
        ];
    }

    public function dadosOrganizacao(): array
    {
        return collect($this->validated())->only(['nome', 'documento', 'plano', 'status'])->all();
    }
}
