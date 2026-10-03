<?php

namespace App\Models;

use App\Models\Concerns\Auditavel;
use App\Models\Concerns\PertenceAOrganizacao;
use Database\Factories\FuncionarioFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Table('funcionarios')]
#[Fillable([
    'nome', 'data_nascimento', 'cpf', 'rg', 'genero', 'estado_civil', 'nacionalidade',
    'estado', 'cidade', 'cep', 'logradouro', 'complemento', 'numero', 'bairro',
    'funcao_cargo', 'departamento_setor', 'tipo_contrato', 'salario_base',
    'telefone_principal', 'telefone_secundario', 'email',
    'data_admissao', 'proximo_exame', 'status',
])]
class Funcionario extends Model
{
    use Auditavel, PertenceAOrganizacao;

    /** @use HasFactory<FuncionarioFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'data_nascimento' => 'date',
            'data_admissao' => 'date',
            'proximo_exame' => 'date',
            'salario_base' => 'decimal:2',
        ];
    }

    public function certificacoes(): HasMany
    {
        return $this->hasMany(FuncionarioCertificacao::class);
    }

    public function projetosResponsavel(): HasMany
    {
        return $this->hasMany(Projeto::class, 'responsavel_id');
    }
}
