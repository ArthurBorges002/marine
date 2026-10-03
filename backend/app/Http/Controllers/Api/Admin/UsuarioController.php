<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UsuarioRequest;
use App\Http\Resources\UsuarioResource;
use App\Services\UsuarioService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Usuários da organização do usuário logado. Não há exclusão: desativar preserva o histórico. */
class UsuarioController extends Controller
{
    public function __construct(private UsuarioService $usuarios) {}

    public function index(): AnonymousResourceCollection
    {
        return UsuarioResource::collection(
            $this->usuarios->daOrganizacao()->with('organizacao', 'perfil')->orderBy('nome')->get()
        );
    }

    public function store(UsuarioRequest $request): UsuarioResource
    {
        $usuario = $this->usuarios->criar($request->validated());

        return new UsuarioResource($usuario->load('organizacao', 'perfil'));
    }

    public function update(UsuarioRequest $request, int $usuario): UsuarioResource
    {
        $atualizado = $this->usuarios->atualizar($this->usuarios->encontrar($usuario), $request->validated(), $request->user());

        return new UsuarioResource($atualizado->load('organizacao', 'perfil'));
    }
}
