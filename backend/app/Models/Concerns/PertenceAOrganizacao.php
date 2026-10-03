<?php

namespace App\Models\Concerns;

use App\Models\Organizacao;
use App\Support\OrganizacaoAtual;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Isolamento entre clientes do SaaS: toda consulta do model é filtrada pela organização
 * atual e todo registro novo recebe organizacao_id. Obrigatório em todo model de negócio
 * (verificado por ArquiteturaTest).
 */
trait PertenceAOrganizacao
{
    public static function bootPertenceAOrganizacao(): void
    {
        static::addGlobalScope('organizacao', function (Builder $query) {
            $query->where($query->qualifyColumn('organizacao_id'), OrganizacaoAtual::id());
        });

        static::creating(function (Model $model) {
            $model->organizacao_id ??= OrganizacaoAtual::id();
        });
    }

    public function organizacao(): BelongsTo
    {
        return $this->belongsTo(Organizacao::class);
    }
}
