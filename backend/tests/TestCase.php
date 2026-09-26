<?php

namespace Tests;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    protected function autenticar(array $atributos = []): Usuario
    {
        $usuario = Usuario::factory()->create($atributos);
        Sanctum::actingAs($usuario);

        return $usuario;
    }
}
