<?php

namespace Tests\Feature;

use App\Models\ConfiguracaoCadastro;
use App\Models\ModeloCapa;
use App\Models\ModeloOrcamento;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ModelosETemplatesTest extends TestCase
{
    use RefreshDatabase;

    public function test_crud_modelo_orcamento(): void
    {
        $usuario = $this->autenticar();

        $id = $this->postJson('/api/modelos-orcamento', ['nome' => 'Padrão', 'cabecalho' => '<p>c</p>', 'corpo' => '<p>b</p>', 'rodape' => '<p>r</p>'])
            ->assertCreated()->json('codigo');

        $this->getJson('/api/modelos-orcamento')->assertOk()->assertExactJson([['codigo' => (string) $id, 'nome' => 'Padrão']]);
        $this->getJson("/api/modelos-orcamento/$id")->assertOk()->assertJsonPath('corpo', '<p>b</p>');

        $this->putJson("/api/modelos-orcamento/$id", ['nome' => 'Comercial', 'corpo' => '<p>novo</p>'])->assertOk();
        $modelo = ModeloOrcamento::find($id);
        $this->assertSame('Comercial', $modelo->nome);
        $this->assertSame($usuario->id, $modelo->atualizado_por_id);

        $this->postJson('/api/modelos-orcamento', ['nome' => ''])->assertStatus(422)->assertJsonValidationErrors('nome');
    }

    public function test_crud_modelo_capa(): void
    {
        $this->autenticar();

        $id = $this->postJson('/api/modelos-capa', ['nome' => 'Capa 1', 'capa' => '<h1>Olá</h1>'])->assertCreated()->json('codigo');
        $this->getJson("/api/modelos-capa/$id")->assertOk()->assertJsonPath('capa', '<h1>Olá</h1>');
        $this->putJson("/api/modelos-capa/$id", ['nome' => 'Capa 2', 'capa' => '<h1>Oi</h1>'])->assertOk();
        $this->assertSame('<h1>Oi</h1>', ModeloCapa::find($id)->conteudo);
        $this->getJson('/api/modelos-capa/999')->assertNotFound();
    }

    public function test_upload_e_listagem_de_templates(): void
    {
        Storage::fake('local');
        $this->autenticar();

        $this->post('/api/templates-pdf', [
            'arquivo' => UploadedFile::fake()->image('timbrado.png', 100, 140),
            'nomeModelo' => 'Comercial',
            'tipo' => 'doc',
        ], ['Accept' => 'application/json'])->assertCreated()->assertJsonPath('status', 'sucesso');

        $lista = $this->getJson('/api/templates-pdf/documentos')->assertOk()->assertJsonCount(1)->json();
        $this->assertSame('Comercial', $lista[0]['template_doc_nome']);
        $this->getJson('/api/templates-pdf/capas')->assertOk()->assertJsonCount(0);

        // Imagem é pública (usada como background CSS)
        $this->app['auth']->forgetGuards();
        $this->get('/api/templates-pdf/imagem/'.$lista[0]['template_doc_nome_arquivo'])->assertOk();

        $this->autenticar();
        $this->post('/api/templates-pdf', [
            'arquivo' => UploadedFile::fake()->create('doc.pdf', 10, 'application/pdf'),
            'nomeModelo' => 'X',
            'tipo' => 'capa',
        ], ['Accept' => 'application/json'])->assertStatus(422)->assertJsonValidationErrors('arquivo');
    }

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
