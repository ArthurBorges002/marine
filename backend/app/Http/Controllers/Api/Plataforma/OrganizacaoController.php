<?php

namespace App\Http\Controllers\Api\Plataforma;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plataforma\OrganizacaoRequest;
use App\Http\Resources\OrganizacaoResource;
use App\Models\Organizacao;
use App\Services\OrganizacaoService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Administração dos clientes do SaaS (só administrador da plataforma). */
class OrganizacaoController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return OrganizacaoResource::collection(Organizacao::withCount('usuarios')->orderBy('nome')->get());
    }

    public function store(OrganizacaoRequest $request, OrganizacaoService $organizacoes): OrganizacaoResource
    {
        $organizacao = $organizacoes->criar($request->dadosOrganizacao(), $request->validated('administrador'));

        return new OrganizacaoResource($organizacao->loadCount('usuarios'));
    }

    public function update(OrganizacaoRequest $request, Organizacao $organizacao): OrganizacaoResource
    {
        $organizacao->update($request->dadosOrganizacao());

        return new OrganizacaoResource($organizacao->loadCount('usuarios'));
    }
}
