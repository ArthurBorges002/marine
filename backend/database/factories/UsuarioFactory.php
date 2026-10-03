<?php

namespace Database\Factories;

use App\Models\Organizacao;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * Usada apenas nos testes automatizados.
 *
 * @extends Factory<Usuario>
 */
class UsuarioFactory extends Factory
{
    protected $model = Usuario::class;

    public function definition(): array
    {
        return [
            'organizacao_id' => Organizacao::factory(),
            'nome' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
            'tipo' => 'usuario',
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => ['tipo' => 'admin']);
    }

    /** Administrador da plataforma: sem organização. */
    public function plataforma(): static
    {
        return $this->state(fn () => ['organizacao_id' => null, 'administrador_plataforma' => true, 'tipo' => 'admin']);
    }
}
