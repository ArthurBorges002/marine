<?php

namespace Tests\Feature;

use App\Models\ConfiguracaoCadastro;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConfiguracaoCadastroTest extends TestCase
{
    use RefreshDatabase;

    public function test_configuracao_de_cadastro(): void
    {
        $this->autenticar();
        $config = [
            'principal' => ['mostrarBloco' => true, 'nomeCompleto' => true],
            'endereco' => ['mostrarBloco' => false, 'cep' => false],
            'contato' => ['mostrarBloco' => true, 'email' => true],
            'dadosProfissionais' => ['mostrarBloco' => true, 'funcaoCargo' => true],
            'documento' => ['documentosFuncionario' => true],
            'certificacoes' => ['certificacoesFuncionario' => false],
        ];
        ConfiguracaoCadastro::create(['id' => 1, 'tela' => 'funcionario', 'configuracao' => $config]);

        $this->getJson('/api/configuracoes-cadastro/1')->assertOk()->assertExactJson($config);

        $config['endereco']['cep'] = true;
        $this->putJson('/api/configuracoes-cadastro/1', ['tela' => 1, 'config' => $config])->assertOk()->assertJsonPath('status', 'Certo');
        $this->assertTrue(ConfiguracaoCadastro::find(1)->configuracao['endereco']['cep']);

        $this->putJson('/api/configuracoes-cadastro/1', ['config' => ['principal' => 'x']])->assertStatus(422);
    }
}
