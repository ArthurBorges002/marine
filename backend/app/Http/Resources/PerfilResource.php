<?php

namespace App\Http\Resources;

use App\Models\Perfil;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Perfil */
class PerfilResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'descricao' => $this->descricao,
            'administrador' => $this->administrador,
            'permissoes' => $this->permissoes(),
            'usuarios' => $this->whenCounted('usuarios'),
        ];
    }
}
