<?php

namespace Tests;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    /** Hosts onde os testes podem rodar: RefreshDatabase apaga todas as tabelas do banco. */
    private const HOSTS_PERMITIDOS = ['127.0.0.1', 'localhost'];

    protected function autenticar(array $atributos = []): Usuario
    {
        $usuario = Usuario::factory()->create($atributos);
        Sanctum::actingAs($usuario);

        return $usuario;
    }

    /**
     * Trava de segurança: roda antes dos traits (RefreshDatabase recria o banco) e
     * só aceita SQLite ou PostgreSQL local, nunca um banco remoto (ex.: Neon).
     */
    protected function setUpTraits()
    {
        $config = config('database.connections.'.config('database.default'));
        $local = $config['driver'] === 'sqlite'
            || (empty($config['url']) && in_array($config['host'] ?? null, self::HOSTS_PERMITIDOS, true));

        if (! $local) {
            throw new RuntimeException(
                'Testes abortados: o banco de teste não é local. '
                .'Use phpunit.xml (SQLite) ou phpunit.pgsql.xml com um PostgreSQL em 127.0.0.1.'
            );
        }

        return parent::setUpTraits();
    }
}
