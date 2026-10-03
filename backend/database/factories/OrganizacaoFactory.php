<?php

namespace Database\Factories;

use App\Models\Organizacao;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Usada apenas nos testes automatizados.
 *
 * @extends Factory<Organizacao>
 */
class OrganizacaoFactory extends Factory
{
    protected $model = Organizacao::class;

    public function definition(): array
    {
        return [
            'nome' => fake()->company(),
            'status' => 'ativa',
        ];
    }

    public function suspensa(): static
    {
        return $this->state(fn () => ['status' => 'suspensa']);
    }
}
