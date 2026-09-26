<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjetoResource;
use App\Models\Projeto;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(DashboardService $dashboard): JsonResponse
    {
        return response()->json([
            'estatisticas' => $dashboard->estatisticas(),
            'alertas' => $dashboard->alertas(),
            'projetos' => ProjetoResource::collection(Projeto::with('responsavel')->orderBy('id')->get()),
        ]);
    }
}
