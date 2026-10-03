<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Rotas de negócio: o usuário precisa pertencer a uma organização ativa. */
class ExigeOrganizacaoAtiva
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();
        $organizacao = $usuario?->organizacao;

        abort_if($organizacao === null, 403, 'Acesso permitido apenas a usuários de uma organização.');
        abort_unless($usuario->ativo, 403, 'Usuário desativado. Fale com o administrador da sua empresa.');
        abort_unless($organizacao->isAtiva(), 403, 'Organização suspensa. Entre em contato com o suporte.');

        return $next($request);
    }
}
