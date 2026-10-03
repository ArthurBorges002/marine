<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AlterarSenhaRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\Auditoria;
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
            // Só registra tentativas em contas que existem (na auditoria da organização delas)
            if ($usuario) {
                Auditoria::registrar('login_falhou', $usuario, usuario: $usuario);
            }
            throw ValidationException::withMessages(['email' => 'Email ou senha incorretos']);
        }

        if (! $usuario->ativo) {
            throw ValidationException::withMessages(['email' => 'Usuário desativado. Fale com o administrador da sua empresa.']);
        }

        if (! $usuario->isAdministradorPlataforma() && ! $usuario->organizacao?->isAtiva()) {
            throw ValidationException::withMessages(['email' => 'Organização suspensa. Entre em contato com o suporte.']);
        }

        // saveQuietly: o último acesso não é uma alteração de cadastro (o login já vai para a auditoria)
        $usuario->forceFill(['ultimo_acesso_em' => now()])->saveQuietly();
        Auditoria::registrar('login', $usuario, usuario: $usuario);

        return response()->json([
            'token' => $usuario->createToken('frontend')->plainTextToken,
            'usuario' => new UsuarioResource($usuario->load('organizacao', 'perfil')),
        ]);
    }

    public function me(Request $request): UsuarioResource
    {
        return new UsuarioResource($request->user()->load('organizacao', 'perfil'));
    }

    public function alterarSenha(AlterarSenhaRequest $request): JsonResponse
    {
        $usuario = $request->user();
        $usuario->update(['password' => $request->validated('nova_senha')]);
        Auditoria::registrar('atualizado', $usuario, null, ['senha' => 'alterada pelo próprio usuário']);

        // Encerra as outras sessões; a atual continua
        $usuario->tokens()->where('id', '<>', $usuario->currentAccessToken()->id)->delete();

        return response()->json(['status' => 'Certo']);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['status' => 'Certo']);
    }
}
