<?php

namespace App\Models;

use App\Models\Concerns\Auditavel;
use App\Models\Concerns\PertenceAOrganizacao;
use App\Support\Permissoes;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

/**
 * Conjunto de permissões de uma organização. As permissões são chaves do catálogo
 * (App\Support\Permissoes) gravadas em perfil_permissoes.
 */
#[Table('perfis')]
#[Fillable(['nome', 'descricao'])]
class Perfil extends Model
{
    use Auditavel, PertenceAOrganizacao;

    /** @var list<string>|null */
    private ?array $chavesCarregadas = null;

    protected function casts(): array
    {
        return ['administrador' => 'boolean'];
    }

    public function usuarios(): HasMany
    {
        return $this->hasMany(Usuario::class);
    }

    /** @return list<string> Permissões efetivas (Administrador: o catálogo inteiro). */
    public function permissoes(): array
    {
        if ($this->administrador) {
            return Permissoes::chaves();
        }

        return $this->chavesCarregadas ??= DB::table('perfil_permissoes')
            ->where('perfil_id', $this->id)
            ->orderBy('permissao')
            ->pluck('permissao')
            ->all();
    }

    public function permite(string $permissao): bool
    {
        return in_array($permissao, $this->permissoes(), true);
    }

    /** @param list<string> $permissoes chaves do catálogo (validadas no request) */
    public function sincronizarPermissoes(array $permissoes): void
    {
        $antes = $this->permissoes();
        $depois = array_values(array_unique($permissoes));
        sort($depois);

        DB::transaction(function () use ($depois) {
            DB::table('perfil_permissoes')->where('perfil_id', $this->id)->delete();
            DB::table('perfil_permissoes')->insert(
                array_map(fn (string $p) => ['perfil_id' => $this->id, 'permissao' => $p], $depois),
            );
        });
        $this->chavesCarregadas = $depois;

        if ($antes !== $depois) {
            Auditoria::registrar('atualizado', $this, ['permissoes' => $antes], ['permissoes' => $depois]);
        }
    }
}
