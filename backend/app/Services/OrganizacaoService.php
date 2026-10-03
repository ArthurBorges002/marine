<?php

namespace App\Services;

use App\Models\Organizacao;
use App\Models\Usuario;
use App\Support\PerfisPadrao;
use Illuminate\Support\Facades\DB;

class OrganizacaoService
{
    /**
     * Cria a organização (cliente do SaaS), os perfis padrão e o primeiro administrador dela.
     *
     * @param  array{nome: string, documento?: ?string, plano?: ?string}  $dados
     * @param  array{nome: string, email: string, senha: string}  $administrador
     */
    public function criar(array $dados, array $administrador): Organizacao
    {
        return DB::transaction(function () use ($dados, $administrador) {
            $organizacao = Organizacao::create($dados + ['status' => 'ativa']);
            $perfis = PerfisPadrao::criarNoBanco($organizacao->id);

            $usuario = new Usuario([
                'nome' => $administrador['nome'],
                'email' => $administrador['email'],
                'password' => $administrador['senha'],
            ]);
            $usuario->organizacao_id = $organizacao->id;
            $usuario->perfil_id = $perfis[PerfisPadrao::ADMINISTRADOR];
            $usuario->save();

            return $organizacao;
        });
    }
}
