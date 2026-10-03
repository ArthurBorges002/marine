<?php

namespace App\Support;

use App\Exceptions\SemOrganizacaoException;
use App\Models\Organizacao;
use Closure;
use Illuminate\Support\Facades\Auth;

/**
 * Organização em que as consultas de negócio são feitas.
 * Por padrão é a do usuário autenticado; jobs, comandos e a administração da plataforma
 * definem uma explicitamente com executarComo(). Sem organização, nenhuma consulta de
 * negócio roda (SemOrganizacaoException), para nunca misturar dados de clientes.
 *
 * Registrada como "scoped": é descartada a cada requisição/job.
 */
class OrganizacaoAtual
{
    private ?int $explicita = null;

    public static function id(): int
    {
        return app(self::class)->resolver();
    }

    /** Executa $callback com as consultas restritas à organização informada. */
    public static function executarComo(Organizacao|int $organizacao, Closure $callback): mixed
    {
        $atual = app(self::class);
        $anterior = $atual->explicita;
        $atual->explicita = $organizacao instanceof Organizacao ? $organizacao->id : $organizacao;

        try {
            return $callback();
        } finally {
            $atual->explicita = $anterior;
        }
    }

    private function resolver(): int
    {
        $id = $this->explicita ?? Auth::user()?->organizacao_id;

        if (! $id) {
            throw new SemOrganizacaoException;
        }

        return $id;
    }
}
