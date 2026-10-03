<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;

/** Consulta de dados de negócio sem uma organização definida (ex.: administrador da plataforma). */
class SemOrganizacaoException extends HttpException
{
    public function __construct()
    {
        parent::__construct(403, 'Acesso permitido apenas a usuários de uma organização.');
    }
}
