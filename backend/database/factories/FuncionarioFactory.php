<?php

namespace Database\Factories;

use App\Models\Funcionario;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Usada apenas nos testes automatizados.
 *
 * @extends Factory<Funcionario>
 */
class FuncionarioFactory extends Factory
{
    protected $model = Funcionario::class;

    public function definition(): array
    {
        return [
            'nome' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'telefone_principal' => '(11) 99999-0000',
            'funcao_cargo' => 'Mergulhador',
            'data_admissao' => '2024-01-10',
            'status' => 'ativo',
        ];
    }
}
