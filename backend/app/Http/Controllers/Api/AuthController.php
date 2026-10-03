<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $usuario = Usuario::where('email', $request->input('email'))->first();

        if (! $usuario || ! Hash::check($request->input('senha'), $usuario->password)) {
            throw ValidationException::withMessages(['email' => 'Email ou senha incorretos']);
        }

        if (! $usuario->isAdministradorPlataforma() && ! $usuario->organizacao?->isAtiva()) {
            throw ValidationException::withMessages(['email' => 'Organização suspensa. Entre em contato com o suporte.']);
        }

        return response()->json([
            'token' => $usuario->createToken('frontend')->plainTextToken,
            'usuario' => new UsuarioResource($usuario->load('organizacao')),
        ]);
    }

    public function me(Request $request): UsuarioResource
    {
        return new UsuarioResource($request->user()->load('organizacao'));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['status' => 'Certo']);
    }
}
