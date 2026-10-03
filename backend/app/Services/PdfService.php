<?php

namespace App\Services;

use Mpdf\Mpdf;

/**
 * Geração de PDFs a partir de HTML com mPDF (termos, políticas, relatórios),
 * com cabeçalho/rodapé, papel timbrado (imagem de fundo) e marca d'água opcionais.
 */
class PdfService
{
    public function __construct(private TemplatePdfService $templates) {}

    /**
     * "papel_timbrado" é o identificador ("arquivo") de um template do tipo documento.
     *
     * @param  array{cabecalho?: ?string, rodape?: ?string, papel_timbrado?: ?string, marca_dagua?: ?string}  $opcoes
     */
    public function gerar(string $html, array $opcoes = []): string
    {
        $mpdf = $this->novoMpdf();
        $mpdf->setAutoTopMargin = 'stretch';
        $mpdf->setAutoBottomMargin = 'stretch';

        $mpdf->SetHTMLHeader((string) ($opcoes['cabecalho'] ?? ''));
        $mpdf->SetHTMLFooter((string) ($opcoes['rodape'] ?? ''));
        $this->aplicarFundo($mpdf, $this->templates->caminhoAbsoluto($opcoes['papel_timbrado'] ?? null, 'documento'));
        $this->aplicarMarcaDagua($mpdf, $opcoes['marca_dagua'] ?? null);

        $mpdf->WriteHTML($html);

        return $mpdf->Output('', 'S');
    }

    private function novoMpdf(): Mpdf
    {
        $tempDir = storage_path('app/mpdf');
        if (! is_dir($tempDir)) {
            mkdir($tempDir, 0775, true);
        }

        return new Mpdf([
            'format' => 'A4',
            'margin_left' => 5,
            'margin_right' => 5,
            'tempDir' => $tempDir,
        ]);
    }

    private function aplicarFundo(Mpdf $mpdf, ?string $caminhoImagem): void
    {
        if ($caminhoImagem) {
            $mpdf->SetDefaultBodyCSS('background', "url('".str_replace('\\', '/', $caminhoImagem)."')");
            $mpdf->SetDefaultBodyCSS('background-image-resize', 6);
        }
    }

    private function aplicarMarcaDagua(Mpdf $mpdf, ?string $texto): void
    {
        if ($texto !== null && $texto !== '') {
            $mpdf->SetWatermarkText($texto, 0.1);
            $mpdf->showWatermarkText = true;
        }
    }
}
