<?php

namespace App\Models;

use Database\Factories\UsuarioFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Não usa PertenceAOrganizacao: o login acontece antes de se saber a organização.
 * Consultas de usuários de uma organização devem filtrar organizacao_id explicitamente.
 * organizacao_id nulo = administrador da plataforma (dono do SaaS).
 */
#[Table('usuarios')]
#[Fillable(['nome', 'email', 'password', 'tipo'])]
#[Hidden(['password', 'remember_token'])]
class Usuario extends Authenticatable
{
    /** @use HasFactory<UsuarioFactory> */
    use HasApiTokens, HasFactory;

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'administrador_plataforma' => 'boolean',
        ];
    }

    public function organizacao(): BelongsTo
    {
        return $this->belongsTo(Organizacao::class);
    }

    public function isAdmin(): bool
    {
        return $this->tipo === 'admin';
    }

    public function isAdministradorPlataforma(): bool
    {
        return $this->administrador_plataforma && $this->organizacao_id === null;
    }
}
