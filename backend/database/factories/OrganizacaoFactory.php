<?php

namespace Database\Factories;

use App\Models\Organizacao;
use App\Support\PerfisPadrao;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Usada apenas nos testes automatizados. Toda organização nasce com os perfis padrão.
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

    public function configure(): static
    {
        return $this->afterCreating(fn (Organizacao $organizacao) => PerfisPadrao::criarNoBanco($organizacao->id));
    }

    public function suspensa(): static
    {
        return $this->state(fn () => ['status' => 'suspensa']);
    }
}
