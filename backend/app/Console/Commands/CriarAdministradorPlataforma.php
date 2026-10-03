<?php

namespace App\Console\Commands;

use App\Models\Usuario;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

/** Cria um administrador da plataforma (dono do SaaS, sem organização). */
class CriarAdministradorPlataforma extends Command
{
    protected $signature = 'integra:admin-plataforma {email} {--nome=Administrador da plataforma}';

    protected $description = 'Cria um administrador da plataforma (gerencia as organizações clientes)';

    public function handle(): int
    {
        $email = $this->argument('email');
        $senha = $this->secret('Senha (mínimo 8 caracteres)');

        $validacao = Validator::make(
            ['email' => $email, 'senha' => $senha],
            ['email' => ['required', 'email', 'unique:usuarios,email'], 'senha' => ['required', 'string', 'min:8']],
        );
        if ($validacao->fails()) {
            foreach ($validacao->errors()->all() as $erro) {
                $this->error($erro);
            }

            return self::FAILURE;
        }

        $usuario = new Usuario([
            'nome' => $this->option('nome'),
            'email' => $email,
            'password' => $senha,
            'tipo' => 'admin',
        ]);
        $usuario->administrador_plataforma = true;
        $usuario->save();

        $this->info("Administrador da plataforma criado: {$email}");

        return self::SUCCESS;
    }
}
