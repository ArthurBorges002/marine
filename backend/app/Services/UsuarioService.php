<?php

namespace App\Services;

use App\Models\Perfil;
use App\Models\Usuario;
use App\Support\OrganizacaoAtual;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/** Usuários da organização atual (Usuario não tem escopo global: o filtro é feito aqui). */
class UsuarioService
{
    public function daOrganizacao(): Builder
    {
        return Usuario::query()->where('organizacao_id', OrganizacaoAtual::id());
    }

    public function encontrar(int $id): Usuario
    {
        return $this->daOrganizacao()->findOrFail($id);
    }

    /** @param array{nome: string, email: string, senha: string, perfil_id: int, ativo?: bool} $dados */
    public function criar(array $dados): Usuario
    {
        $usuario = new Usuario([
            'nome' => $dados['nome'],
            'email' => $dados['email'],
            'password' => $dados['senha'],
            'ativo' => $dados['ativo'] ?? true,
        ]);
        $usuario->organizacao_id = OrganizacaoAtual::id();
        $usuario->perfil_id = $dados['perfil_id'];
        $usuario->save();

        return $usuario;
    }

    /** @param array{nome?: string, email?: string, senha?: ?string, perfil_id?: int, ativo?: bool} $dados */
    public function atualizar(Usuario $usuario, array $dados, Usuario $autor): Usuario
    {
        $mudaPerfil = isset($dados['perfil_id']) && (int) $dados['perfil_id'] !== $usuario->perfil_id;
        $desativa = array_key_exists('ativo', $dados) && ! $dados['ativo'] && $usuario->ativo;

        if ($usuario->is($autor) && ($mudaPerfil || $desativa)) {
            throw ValidationException::withMessages([
                $desativa ? 'ativo' : 'perfil_id' => 'Você não pode desativar nem trocar o perfil do seu próprio usuário.',
            ]);
        }

        return DB::transaction(function () use ($usuario, $dados, $mudaPerfil, $desativa) {
            if (($mudaPerfil || $desativa) && $usuario->perfil?->administrador) {
                $novoPerfil = $mudaPerfil ? Perfil::find($dados['perfil_id']) : $usuario->perfil;
                if ($desativa || ! $novoPerfil?->administrador) {
                    $this->garantirOutroAdministrador($usuario);
                }
            }

            $usuario->fill(array_intersect_key($dados, array_flip(['nome', 'email', 'ativo'])));
            if (! empty($dados['senha'])) {
                $usuario->password = $dados['senha'];
            }
            if ($mudaPerfil) {
                $usuario->perfil_id = $dados['perfil_id'];
            }
            $usuario->save();

            if ($desativa) {
                $usuario->tokens()->delete(); // derruba as sessões abertas
            }

            return $usuario;
        });
    }

    /** A organização nunca fica sem um Administrador ativo (senão ninguém gerencia acessos). */
    private function garantirOutroAdministrador(Usuario $usuario): void
    {
        $outros = $this->daOrganizacao()
            ->where('id', '<>', $usuario->id)
            ->where('ativo', true)
            ->whereHas('perfil', fn (Builder $q) => $q->where('administrador', true))
            ->lockForUpdate()
            ->exists();

        if (! $outros) {
            throw ValidationException::withMessages([
                'perfil_id' => 'A organização precisa de pelo menos um Administrador ativo.',
            ]);
        }
    }
}
