<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Auth;

/**
 * Registro de quem fez o quê. Não usa PertenceAOrganizacao: ações da plataforma não têm
 * organização. Toda consulta de auditoria de um cliente filtra organizacao_id explicitamente.
 * Registros são imutáveis (sem updated_at; nunca editados pela aplicação).
 */
#[Table('auditorias')]
#[Fillable(['organizacao_id', 'usuario_id', 'acao', 'auditavel_type', 'auditavel_id', 'antes', 'depois', 'ip', 'user_agent'])]
class Auditoria extends Model
{
    public const UPDATED_AT = null;

    public const ACOES = ['criado', 'atualizado', 'excluido', 'login', 'login_falhou'];

    protected function casts(): array
    {
        return [
            'antes' => 'array',
            'depois' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function auditavel(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Grava um registro. A organização vem do registro auditado (ou da própria organização),
     * senão do usuário autenticado.
     */
    public static function registrar(string $acao, ?Model $model, ?array $antes = null, ?array $depois = null, ?Usuario $usuario = null): self
    {
        $usuario ??= Auth::user();
        $organizacaoId = match (true) {
            $model instanceof Organizacao => $model->id,
            $model !== null && $model->getAttribute('organizacao_id') !== null => $model->getAttribute('organizacao_id'),
            default => $usuario?->organizacao_id,
        };

        return static::create([
            'organizacao_id' => $organizacaoId,
            'usuario_id' => $usuario?->id,
            'acao' => $acao,
            'auditavel_type' => $model ? $model->getMorphClass() : null,
            'auditavel_id' => $model?->getKey(),
            'antes' => $antes ?: null,
            'depois' => $depois ?: null,
            'ip' => request()?->ip(),
            'user_agent' => mb_substr((string) request()?->userAgent(), 0, 255) ?: null,
        ]);
    }
}
