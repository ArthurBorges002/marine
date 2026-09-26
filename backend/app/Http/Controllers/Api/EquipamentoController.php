<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EquipamentoResource;
use App\Models\Equipamento;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EquipamentoController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return EquipamentoResource::collection(Equipamento::with('projeto')->orderBy('id')->get());
    }
}
