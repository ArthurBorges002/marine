<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaEntrada;
use App\Support\RegrasOrganizacao;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Recebe o formulário de cadastro/edição de funcionário (multipart/form-data)
 * com os mesmos nomes de campos usados pelo frontend.
 */
class FuncionarioRequest extends FormRequest
{
    use NormalizaEntrada;

    protected function prepareForValidation(): void
    {
        $this->merge([
            'data_nascimento' => $this->normalizarData($this->input('data_nascimento')),
            'salario_base' => $this->normalizarDecimal($this->input('salario_base')),
            'estado' => $this->vazioParaNull($this->input('estado')),
            'cidade' => $this->vazioParaNull($this->input('cidade')),
        ]);
    }

    public function rules(): array
    {
        $funcionario = $this->route('funcionario');

        return [
            'nome_completo' => ['required', 'string', 'max:255'],
            'data_nascimento' => ['nullable', 'date', 'before:today'],
            'cpf' => ['nullable', 'string', 'max:14', RegrasOrganizacao::unico('funcionarios', 'cpf')->ignore($funcionario)],
            'rg' => ['nullable', 'string', 'max:20'],
            'genero' => ['nullable', 'string', 'max:30'],
            'estado_civil' => ['nullable', 'string', 'max:30'],
            'nacionalidade' => ['nullable', 'string', 'max:60'],
            'estado' => ['nullable', 'string', 'size:2'],
            'cidade' => ['nullable', 'string', 'max:120'],
            'cep' => ['nullable', 'string', 'max:9'],
            'logradouro' => ['nullable', 'string', 'max:255'],
            'complemento' => ['nullable', 'string', 'max:255'],
            'numero' => ['nullable', 'string', 'max:20'],
            'bairro' => ['nullable', 'string', 'max:120'],
            'telefone1' => ['nullable', 'string', 'max:20'],
            'telefone2' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'funcao_cargo' => ['nullable', 'string', 'max:120'],
            'departamento_setor' => ['nullable', 'string', 'max:120'],
            'tipo_contrato' => ['nullable', 'string', 'max:60'],
            'salario_base' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return ['nome_completo' => 'nome completo'];
    }

    /** Mapeia os nomes do formulário para as colunas da tabela. */
    public function dadosFuncionario(): array
    {
        $dados = $this->validated();

        return [
            'nome' => $dados['nome_completo'],
            'data_nascimento' => $dados['data_nascimento'] ?? null,
            'cpf' => $dados['cpf'] ?? null,
            'rg' => $dados['rg'] ?? null,
            'genero' => $dados['genero'] ?? null,
            'estado_civil' => $dados['estado_civil'] ?? null,
            'nacionalidade' => $dados['nacionalidade'] ?? null,
            'estado' => $dados['estado'] ?? null,
            'cidade' => $dados['cidade'] ?? null,
            'cep' => $dados['cep'] ?? null,
            'logradouro' => $dados['logradouro'] ?? null,
            'complemento' => $dados['complemento'] ?? null,
            'numero' => $dados['numero'] ?? null,
            'bairro' => $dados['bairro'] ?? null,
            'telefone_principal' => $dados['telefone1'] ?? null,
            'telefone_secundario' => $dados['telefone2'] ?? null,
            'email' => $dados['email'] ?? null,
            'funcao_cargo' => $dados['funcao_cargo'] ?? null,
            'departamento_setor' => $dados['departamento_setor'] ?? null,
            'tipo_contrato' => $dados['tipo_contrato'] ?? null,
            'salario_base' => $dados['salario_base'] ?? null,
        ];
    }
}
