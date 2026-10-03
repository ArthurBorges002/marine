<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PerfilRequest;
use App\Http\Resources\PerfilResource;
use App\Models\Perfil;
use App\Support\Permissoes;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class PerfilController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PerfilResource::collection(
            Perfil::withCount('usuarios')->orderByDesc('administrador')->orderBy('nome')->get()
        );
    }

    /** Só id e nome: opções do campo "perfil" no cadastro de usuário (quem gerencia usuários pode não ver perfis). */
    public function opcoes(): JsonResponse
    {
        return response()->json(
            Perfil::orderByDesc('administrador')->orderBy('nome')->get(['id', 'nome', 'administrador'])
        );
    }

    /** Catálogo de permissões agrupado por módulo (para a matriz da tela). */
    public function catalogo(): JsonResponse
    {
        return response()->json(Permissoes::porModulo());
    }

    public function store(PerfilRequest $request): PerfilResource
    {
        $perfil = DB::transaction(function () use ($request) {
            $perfil = Perfil::create($request->safe()->only(['nome', 'descricao']));
            $perfil->sincronizarPermissoes($request->validated('permissoes', []));

            return $perfil;
        });

        return new PerfilResource($perfil->loadCount('usuarios'));
    }

    public function update(PerfilRequest $request, Perfil $perfil): PerfilResource
    {
        $this->bloquearAdministrador($perfil, 'alterado');

        DB::transaction(function () use ($request, $perfil) {
            $perfil->update($request->safe()->only(['nome', 'descricao']));
            if ($request->has('permissoes')) {
                $perfil->sincronizarPermissoes($request->validated('permissoes'));
            }
        });

        return new PerfilResource($perfil->loadCount('usuarios'));
    }

    public function destroy(Perfil $perfil): JsonResponse
    {
        $this->bloquearAdministrador($perfil, 'excluído');
        abort_if($perfil->usuarios()->exists(), 422, 'Este perfil tem usuários. Mude o perfil deles antes de excluir.');

        $perfil->delete();

        return response()->json(['status' => 'Certo']);
    }

    private function bloquearAdministrador(Perfil $perfil, string $acao): void
    {
        abort_if($perfil->administrador, 422, "O perfil Administrador tem acesso total e não pode ser {$acao}.");
    }
}
