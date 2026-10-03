<?php

namespace App\Http\Resources;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Usuario */
class UsuarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email,
            'ativo' => $this->ativo,
            'administradorPlataforma' => $this->isAdministradorPlataforma(),
            'organizacao' => $this->organizacao ? [
                'id' => $this->organizacao->id,
                'nome' => $this->organizacao->nome,
            ] : null,
            'perfil' => $this->perfil ? [
                'id' => $this->perfil->id,
                'nome' => $this->perfil->nome,
                'administrador' => $this->perfil->administrador,
            ] : null,
            'permissoes' => $this->permissoes(),
            'ultimoAcessoEm' => $this->ultimo_acesso_em?->toIso8601String(),
        ];
    }
}
