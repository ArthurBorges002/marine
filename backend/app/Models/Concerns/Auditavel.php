<?php

namespace App\Models\Concerns;

use App\Models\Auditoria;
use Illuminate\Database\Eloquent\Model;

/**
 * Registra em "auditorias" toda criação, alteração (só os campos que mudaram, com antes e
 * depois) e exclusão do model. Obrigatório em todo model de negócio (ArquiteturaTest).
 * Atenção: updates em massa pelo query builder (Model::where()->update()) não disparam eventos.
 */
trait Auditavel
{
    /** Campos que nunca vão para a auditoria. */
    private static array $camposNaoAuditados = [
        'password', 'remember_token', 'created_at', 'updated_at', 'conteudo_base64',
    ];

    public static function bootAuditavel(): void
    {
        static::created(function (Model $model) {
            Auditoria::registrar('criado', $model, null, self::filtrarAuditaveis($model->getAttributes()));
        });

        static::updated(function (Model $model) {
            $depois = self::filtrarAuditaveis($model->getChanges());
            if ($depois === []) {
                return;
            }
            $antes = [];
            foreach (array_keys($depois) as $campo) {
                $antes[$campo] = $model->getRawOriginal($campo);
            }
            Auditoria::registrar('atualizado', $model, $antes, $depois);
        });

        static::deleted(function (Model $model) {
            Auditoria::registrar('excluido', $model, self::filtrarAuditaveis($model->getAttributes()));
        });
    }

    private static function filtrarAuditaveis(array $dados): array
    {
        return array_diff_key($dados, array_flip(self::$camposNaoAuditados));
    }
}
