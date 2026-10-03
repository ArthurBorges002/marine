<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Rotas de administração do SaaS (organizações). */
class ExigeAdministradorPlataforma
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->isAdministradorPlataforma(), 403, 'Acesso restrito à administração da plataforma.');

        return $next($request);
    }
}
