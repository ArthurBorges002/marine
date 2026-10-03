<?php

namespace Tests\Feature;

use App\Models\TemplatePdf;
use App\Services\PdfService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class PdfServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_gera_pdf_simples(): void
    {
        $pdf = app(PdfService::class)->gerar('<h1>Relatório</h1><p>Conteúdo</p>');

        $this->assertStringStartsWith('%PDF', $pdf);
    }

    public function test_gera_pdf_com_cabecalho_rodape_timbrado_e_marca_dagua(): void
    {
        $this->autenticar();
        $imagem = UploadedFile::fake()->image('timbrado.png', 100, 140);
        TemplatePdf::create([
            'tipo' => 'documento',
            'nome' => 'Timbrado',
            'arquivo' => 'timbrado_teste',
            'extensao' => 'png',
            'conteudo_base64' => base64_encode($imagem->getContent()),
        ]);

        $pdf = app(PdfService::class)->gerar('<p>Termo</p>', [
            'cabecalho' => '<p>Cabeçalho</p>',
            'rodape' => '<p>Rodapé</p>',
            'papel_timbrado' => 'timbrado_teste',
            'marca_dagua' => 'RASCUNHO',
        ]);

        $this->assertStringStartsWith('%PDF', $pdf);
    }

    public function test_timbrado_inexistente_e_ignorado(): void
    {
        $this->autenticar();
        $pdf = app(PdfService::class)->gerar('<p>x</p>', ['papel_timbrado' => 'nao_existe']);

        $this->assertStringStartsWith('%PDF', $pdf);
    }
}
