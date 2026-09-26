<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Formato usado pelo formulário de edição de funcionário
 * (mesmas chaves que o endpoint antigo retornar_funcionario.php).
 *
 * @mixin \App\Models\Funcionario
 */
class FuncionarioDetalheResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'codigo' => $this->id,
            'nome' => $this->nome,
            // O campo do formulário usa a máscara dd/mm/aaaa
            'data_nascimento' => $this->data_nascimento?->format('d/m/Y'),
            'cpf' => $this->cpf,
            'rg' => $this->rg,
            'genero' => $this->genero,
            'estado_civil' => $this->estado_civil,
            'nacionalidade' => $this->nacionalidade,
            'estado' => $this->estado,
            'cidade' => $this->cidade,
            'cep' => $this->cep,
            'logradouro' => $this->logradouro,
            'complemento' => $this->complemento,
            'numero' => $this->numero,
            'bairro' => $this->bairro,
            'funcao_cargo' => $this->funcao_cargo,
            'departamento_setor' => $this->departamento_setor,
            'contrato' => $this->tipo_contrato,
            'salario_base' => $this->salario_base,
            'telefone_principal' => $this->telefone_principal,
            'telefone_secundario' => $this->telefone_secundario,
            'email' => $this->email,
            'data_cadastro' => $this->created_at?->toDateString(),
            'ultima_atualizacao' => $this->updated_at?->toDateString(),
            'ativo' => $this->status === 'ativo' ? 'A' : 'I',
        ];
    }
}
