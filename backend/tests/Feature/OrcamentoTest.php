<?php

namespace Tests\Feature;

use App\Models\ModeloCapa;
use App\Models\ModeloOrcamento;
use App\Models\Orcamento;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrcamentoTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $extra = []): array
    {
        return array_merge([
            'nome_cliente' => 'Porto de Santos',
            'estado' => 'SP',
            'cidade' => 'Santos',
            'info_complementar' => 'Inspeção de casco',
            'valor_total' => '1.500,50',
            'codigo_modelo' => '0',
            'capa_orc' => '',
            'capa_conteudo' => '<h1>Capa</h1>',
            'cabecalho' => '<p>Cabeçalho</p>',
            'corpo' => '<p>Corpo</p>',
            'rodape' => '<p>Rodapé</p>',
            'template_selecionado_capa' => '',
            'template_selecionado_documento' => '',
            'marca_d_agua_capa' => '',
            'marca_d_agua_documento' => 'CONFIDENCIAL',
        ], $extra);
    }

    public function test_cria_orcamento_com_codigo_interno_e_usuario_autenticado(): void
    {
        $usuario = $this->autenticar();

        $resposta = $this->postJson('/api/orcamentos', $this->payload())
            ->assertCreated()
            ->assertJsonPath('status', 'Certo');

        $orcamento = Orcamento::findOrFail($resposta->json('codigo'));
        $this->assertSame(sprintf('ORC-%s-%04d', date('Y'), $orcamento->id), $orcamento->codigo_interno);
        $this->assertSame($usuario->id, $orcamento->usuario_id);
        $this->assertSame('E', $orcamento->status);
        $this->assertSame('1500.50', $orcamento->valor_total);
        $this->assertNull($orcamento->modelo_orcamento_id);
        $this->assertSame('<h1>Capa</h1>', $orcamento->capa);
    }

    public function test_valida_orcamento(): void
    {
        $this->autenticar();

        $this->postJson('/api/orcamentos', $this->payload(['nome_cliente' => '', 'codigo_modelo' => 999, 'valor_total' => 'abc']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nome_cliente', 'codigo_modelo', 'valor_total']);
    }

    public function test_lista_com_filtros_e_paginacao(): void
    {
        $this->autenticar();
        foreach (range(1, 5) as $i) {
            $this->postJson('/api/orcamentos', $this->payload(['nome_cliente' => "Cliente $i"]))->assertCreated();
        }
        Orcamento::where('nome_cliente', 'Cliente 2')->update(['status' => 'A']);

        $p1 = $this->getJson('/api/orcamentos?page=1&search=&status=T&data_inicial=&data_final=')->assertOk();
        $this->assertCount(4, $p1->json('data'));
        $this->assertTrue($p1->json('hasMore'));
        $this->assertSame('Cliente 5', $p1->json('data.0.nome_cliente')); // mais recente primeiro

        $p2 = $this->getJson('/api/orcamentos?page=2&status=T')->assertOk();
        $this->assertCount(1, $p2->json('data'));
        $this->assertFalse($p2->json('hasMore'));

        $this->getJson('/api/orcamentos?status=A')->assertJsonCount(1, 'data')->assertJsonPath('data.0.nome_cliente', 'Cliente 2');
        $this->getJson('/api/orcamentos?search=cliente 3')->assertJsonCount(1, 'data');
        $this->getJson('/api/orcamentos?search=santos')->assertJsonCount(4, 'data'); // busca por cidade

        $hoje = today()->toDateString();
        $this->getJson("/api/orcamentos?data_inicial=$hoje&data_final=$hoje")->assertJsonCount(4, 'data');
        $this->getJson('/api/orcamentos?data_inicial=2000-01-01&data_final=2000-12-31')->assertJsonCount(0, 'data');
    }

    public function test_detalhe_atualiza_status_e_exclui(): void
    {
        $this->autenticar();
        $modelo = ModeloOrcamento::create(['nome' => 'Padrão']);
        $capa = ModeloCapa::create(['nome' => 'Capa', 'conteudo' => '<p>capa modelo</p>']);
        $id = $this->postJson('/api/orcamentos', $this->payload([
            'codigo_modelo' => (string) $modelo->id, 'capa_orc' => (string) $capa->id,
        ]))->json('codigo');

        $this->getJson("/api/orcamentos/$id")->assertOk()
            ->assertJsonPath('codigo_modelo', (string) $modelo->id)
            ->assertJsonPath('codigo_capa', (string) $capa->id)
            ->assertJsonPath('conteudo_capa', '<h1>Capa</h1>')
            ->assertJsonPath('marca_d_agua_documento', 'CONFIDENCIAL');

        $this->putJson("/api/orcamentos/$id", $this->payload(['nome_cliente' => 'Novo Cliente', 'capa_conteudo' => '<h1>Nova</h1>']))
            ->assertOk()->assertJsonPath('status', 'Certo');
        $this->assertDatabaseHas('orcamentos', ['id' => $id, 'nome_cliente' => 'Novo Cliente', 'capa' => '<h1>Nova</h1>']);

        $this->patchJson("/api/orcamentos/$id/status", ['status' => 'A'])->assertOk();
        $this->assertSame('A', Orcamento::find($id)->status);
        $this->patchJson("/api/orcamentos/$id/status", ['status' => 'X'])->assertStatus(422);

        $this->deleteJson("/api/orcamentos/$id")->assertOk();
        $this->assertDatabaseMissing('orcamentos', ['id' => $id]);
        $this->getJson("/api/orcamentos/$id")->assertNotFound();
    }

    public function test_proximo_numero(): void
    {
        $this->autenticar();
        $this->getJson('/api/orcamentos/proximo-numero')->assertOk()->assertExactJson([1]);
    }

    public function test_gera_pdfs(): void
    {
        $this->autenticar();
        $id = $this->postJson('/api/orcamentos', $this->payload())->json('codigo');

        $pdf = $this->get("/api/orcamentos/$id/pdf")->assertOk()->assertHeader('Content-Type', 'application/pdf');
        $this->assertStringStartsWith('%PDF', $pdf->getContent());

        $this->postJson('/api/pdf/documento', ['cabecalho' => '<p>c</p>', 'corpo' => '<p>x</p>', 'marca_d_agua_doc' => 'RASCUNHO'])
            ->assertOk()->assertHeader('Content-Type', 'application/pdf');
        $this->postJson('/api/pdf/capa', ['capa' => '<h1>Capa</h1>'])
            ->assertOk()->assertHeader('Content-Type', 'application/pdf');
    }
}
