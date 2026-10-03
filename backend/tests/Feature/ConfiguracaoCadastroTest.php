<?php

namespace Tests\Feature;

use App\Models\ConfiguracaoCadastro;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConfiguracaoCadastroTest extends TestCase
{
    use RefreshDatabase;

    private function config(): array
    {
        return [
            'principal' => ['mostrarBloco' => true, 'nomeCompleto' => true],
            'endereco' => ['mostrarBloco' => false, 'cep' => false],
            'contato' => ['mostrarBloco' => true, 'email' => true],
            'dadosProfissionais' => ['mostrarBloco' => true, 'funcaoCargo' => true],
            'documento' => ['documentosFuncionario' => true],
            'certificacoes' => ['certificacoesFuncionario' => false],
        ];
    }

    public function test_organizacao_sem_configuracao_recebe_a_padrao(): void
    {
        $this->autenticar();

        $this->getJson('/api/configuracoes-cadastro/1')->assertOk()
            ->assertExactJson(ConfiguracaoCadastro::PADRAO[ConfiguracaoCadastro::TELA_FUNCIONARIO]);
    }

    public function test_salva_e_le_configuracao(): void
    {
        $this->autenticar();
        $config = $this->config();

        $this->putJson('/api/configuracoes-cadastro/1', ['config' => $config])->assertOk()->assertJsonPath('status', 'Certo');
        $this->getJson('/api/configuracoes-cadastro/1')->assertOk()->assertExactJson($config);

        $config['endereco']['cep'] = true;
        $this->putJson('/api/configuracoes-cadastro/1', ['config' => $config])->assertOk();
        $this->assertTrue(ConfiguracaoCadastro::firstWhere('tela', 1)->configuracao['endereco']['cep']);
        $this->assertSame(1, ConfiguracaoCadastro::count());
    }

    public function test_valida_configuracao_e_tela(): void
    {
        $this->autenticar();

        $this->putJson('/api/configuracoes-cadastro/1', ['config' => ['principal' => 'x']])->assertStatus(422);
        $this->getJson('/api/configuracoes-cadastro/99')->assertNotFound();
    }
}
