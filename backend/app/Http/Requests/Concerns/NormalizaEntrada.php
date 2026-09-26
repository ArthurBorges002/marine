<?php

namespace App\Http\Requests\Concerns;

use Carbon\Carbon;

/**
 * Converte os formatos enviados pelo frontend (máscaras pt-BR, selects com "0"
 * significando "nenhum") para valores que podem ser validados e persistidos.
 */
trait NormalizaEntrada
{
    protected function vazioParaNull(mixed $valor): mixed
    {
        return in_array($valor, ['', '0', 0, 'null', 'undefined'], true) ? null : $valor;
    }

    /** "1.500,50" / "R$ 1500,50" / "1500.50" → "1500.50" */
    protected function normalizarDecimal(mixed $valor): mixed
    {
        if ($valor === null || $valor === '') {
            return null;
        }
        if (is_int($valor) || is_float($valor)) {
            return $valor;
        }

        $original = trim((string) $valor);
        $valor = preg_replace('/^R\$\s*/i', '', $original);
        if (str_contains($valor, ',')) {
            $valor = str_replace(['.', ','], ['', '.'], $valor);
        }

        // Se não sobrou um número, devolve o texto original para a validação "numeric" rejeitar
        return is_numeric($valor) ? $valor : ($original === '' ? null : $original);
    }

    /** "20/09/1990" → "1990-09-20"; mantém "1990-09-20". Máscara incompleta vira null. */
    protected function normalizarData(mixed $valor): mixed
    {
        if (! is_string($valor) || trim($valor, " _/-") === '') {
            return null;
        }
        if (preg_match('#^\d{2}/\d{2}/\d{4}$#', $valor)) {
            return Carbon::createFromFormat('!d/m/Y', $valor)?->toDateString() ?? $valor;
        }

        return $valor;
    }
}
