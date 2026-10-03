<?php

namespace App\Models;

use App\Models\Concerns\Auditavel;
use App\Support\Permissoes;
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
#[Fillable(['nome', 'email', 'password', 'ativo'])]
#[Hidden(['password', 'remember_token'])]
class Usuario extends Authenticatable
{
    /** @use HasFactory<UsuarioFactory> */
    use Auditavel, HasApiTokens, HasFactory;

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'administrador_plataforma' => 'boolean',
            'ativo' => 'boolean',
            'ultimo_acesso_em' => 'datetime',
        ];
    }

    public function organizacao(): BelongsTo
    {
        return $this->belongsTo(Organizacao::class);
    }

    /**
     * Sem o escopo global: o perfil é carregado também no login (antes de haver organização
     * no contexto). O perfil_id só é aceito se for da mesma organização (validação).
     */
    public function perfil(): BelongsTo
    {
        return $this->belongsTo(Perfil::class)->withoutGlobalScope('organizacao');
    }

    public function isAdministradorPlataforma(): bool
    {
        return $this->administrador_plataforma && $this->organizacao_id === null;
    }

    public function temPermissao(string $permissao): bool
    {
        return $this->ativo && Permissoes::existe($permissao) && (bool) $this->perfil?->permite($permissao);
    }

    /** @return list<string> */
    public function permissoes(): array
    {
        return $this->ativo ? ($this->perfil?->permissoes() ?? []) : [];
    }
}
