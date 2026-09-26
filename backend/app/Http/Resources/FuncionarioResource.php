<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Formato usado na listagem de funcionários.
 *
 * @mixin \App\Models\Funcionario
 */
class FuncionarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'cpf' => $this->cpf,
            'telefone' => $this->telefone_principal,
            'email' => $this->email,
            'endereco' => $this->enderecoFormatado(),
            'funcao' => $this->funcao_cargo,
            'dataAdmissao' => $this->data_admissao?->toDateString(),
            'status' => $this->status,
            'proximoExame' => $this->proximo_exame?->toDateString(),
            'certificacoes' => $this->whenLoaded('certificacoes', fn () => $this->certificacoes->pluck('nome'), []),
        ];
    }

    private function enderecoFormatado(): ?string
    {
        $rua = trim(implode(', ', array_filter([$this->logradouro, $this->numero])));
        $cidade = trim(implode('/', array_filter([$this->cidade, $this->estado])));

        return trim(implode(' - ', array_filter([$rua, $cidade]))) ?: null;
    }
}
