<?php

namespace Tests\Feature;

use App\Models\Funcionario;
use App\Models\FuncionarioCertificacao;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FuncionarioTest extends TestCase
{
    use RefreshDatabase;

    private function formulario(array $extra = []): array
    {
        return array_merge([
            'nome_completo' => 'Ana Souza',
            'data_nascimento' => '20/09/1990',
            'cpf' => '111.222.333-44',
            'rg' => '12.345.678-9',
            'estado' => 'SP',
            'cidade' => 'Santos',
            'logradouro' => 'Rua A',
            'numero' => '10',
            'telefone1' => '(13) 99999-0000',
            'email' => 'ana@teste.com',
            'funcao_cargo' => 'Mergulhadora',
            'salario_base' => '3.500,00',
        ], $extra);
    }

    public function test_cadastra_funcionario_normalizando_mascaras(): void
    {
        $this->autenticar();

        $id = $this->post('/api/funcionarios', $this->formulario(), ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('msg', 'Sucesso')
            ->json('codigo');

        $f = Funcionario::findOrFail($id);
        $this->assertSame('1990-09-20', $f->data_nascimento->toDateString());
        $this->assertSame('3500.00', $f->salario_base);
        $this->assertSame('(13) 99999-0000', $f->telefone_principal);
        $this->assertSame('ativo', $f->status);
        $this->assertSame(today()->toDateString(), $f->data_admissao->toDateString());
    }

    public function test_valida_cadastro(): void
    {
        $this->autenticar();
        Funcionario::factory()->create(['cpf' => '111.222.333-44']);

        $this->postJson('/api/funcionarios', $this->formulario(['nome_completo' => '', 'email' => 'invalido']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nome_completo', 'email', 'cpf']);
    }

    public function test_detalhe_e_edicao(): void
    {
        $this->autenticar();
        $id = $this->postJson('/api/funcionarios', $this->formulario())->json('codigo');

        $this->getJson("/api/funcionarios/$id")->assertOk()
            ->assertJsonPath('nome', 'Ana Souza')
            ->assertJsonPath('data_nascimento', '20/09/1990')
            ->assertJsonPath('telefone_principal', '(13) 99999-0000')
            ->assertJsonPath('ativo', 'A');

        // O frontend envia multipart com _method=PUT
        $this->post("/api/funcionarios/$id", $this->formulario(['nome_completo' => 'Ana S. Lima', '_method' => 'PUT']), ['Accept' => 'application/json'])
            ->assertOk();

        $this->assertSame('Ana S. Lima', Funcionario::find($id)->nome);
        $this->assertSame(1, Funcionario::count()); // mesmo CPF é permitido para o próprio registro
    }

    public function test_listagem_com_certificacoes(): void
    {
        $this->autenticar();
        $f = Funcionario::factory()->create(['nome' => 'Carlos', 'logradouro' => 'Rua X', 'numero' => '1', 'cidade' => 'Santos', 'estado' => 'SP']);
        FuncionarioCertificacao::create(['funcionario_id' => $f->id, 'nome' => 'PADI Advanced']);

        $this->getJson('/api/funcionarios')->assertOk()
            ->assertJsonPath('0.nome', 'Carlos')
            ->assertJsonPath('0.endereco', 'Rua X, 1 - Santos/SP')
            ->assertJsonPath('0.certificacoes', ['PADI Advanced']);
    }
}
