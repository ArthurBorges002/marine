<?php

namespace App\Services;

use App\Models\Organizacao;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;

class OrganizacaoService
{
    /**
     * Cria a organização (cliente do SaaS) e o primeiro usuário administrador dela.
     *
     * @param  array{nome: string, documento?: ?string, plano?: ?string}  $dados
     * @param  array{nome: string, email: string, senha: string}  $administrador
     */
    public function criar(array $dados, array $administrador): Organizacao
    {
        return DB::transaction(function () use ($dados, $administrador) {
            $organizacao = Organizacao::create($dados + ['status' => 'ativa']);

            $usuario = new Usuario([
                'nome' => $administrador['nome'],
                'email' => $administrador['email'],
                'password' => $administrador['senha'],
                'tipo' => 'admin',
            ]);
            $usuario->organizacao_id = $organizacao->id;
            $usuario->save();

            return $organizacao;
        });
    }
}
