<?php

namespace App\Models;

use App\Models\Concerns\Auditavel;
use Database\Factories\OrganizacaoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Cliente do SaaS. Não usa PertenceAOrganizacao: é a própria fronteira do isolamento. */
#[Table('organizacoes')]
#[Fillable(['nome', 'documento', 'status', 'plano'])]
class Organizacao extends Model
{
    /** @use HasFactory<OrganizacaoFactory> */
    use Auditavel, HasFactory;

    public const STATUS = ['ativa', 'suspensa'];

    public function usuarios(): HasMany
    {
        return $this->hasMany(Usuario::class);
    }

    /** Perfis da organização (sem o escopo global: usado fora do contexto dela, ex. plataforma). */
    public function perfis(): HasMany
    {
        return $this->hasMany(Perfil::class)->withoutGlobalScope('organizacao');
    }

    public function isAtiva(): bool
    {
        return $this->status === 'ativa';
    }
}
