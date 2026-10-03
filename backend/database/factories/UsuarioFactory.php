<?php

namespace Database\Factories;

use App\Models\Organizacao;
use App\Models\Usuario;
use App\Support\PerfisPadrao;
use Closure;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * Usada apenas nos testes automatizados. Por padrão o usuário é Administrador da
 * própria organização; use comPerfil() para testar acessos restritos.
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
            'perfil_id' => self::perfil(PerfisPadrao::ADMINISTRADOR),
            'nome' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
            'ativo' => true,
            'remember_token' => Str::random(10),
        ];
    }

    /** Perfil padrão pelo nome (Administrador, Financeiro, RH, Operacional, Consulta, Funcionário). */
    public function comPerfil(string $nome): static
    {
        return $this->state(['perfil_id' => self::perfil($nome)]);
    }

    public function inativo(): static
    {
        return $this->state(['ativo' => false]);
    }

    /** Administrador da plataforma: sem organização nem perfil. */
    public function plataforma(): static
    {
        return $this->state(['organizacao_id' => null, 'perfil_id' => null, 'administrador_plataforma' => true]);
    }

    /** Resolve o id do perfil na organização do usuário (já criada quando o atributo é calculado). */
    private static function perfil(string $nome): Closure
    {
        return fn (array $atributos) => $atributos['organizacao_id']
            ? Organizacao::find($atributos['organizacao_id'])->perfis()->where('nome', $nome)->value('id')
            : null;
    }
}
