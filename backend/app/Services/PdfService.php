<?php

namespace App\Services;

use Mpdf\Mpdf;

/**
 * Geração dos PDFs de orçamento (capa + cabeçalho/corpo/rodapé) com mPDF.
 * Mantém o comportamento do gerador anterior: capa opcional na primeira página,
 * papel timbrado (imagem de fundo) e marca d'água separados para capa e documento.
 */
class PdfService
{
    public function __construct(private TemplatePdfService $templates) {}

    /**
     * @param  array{capa?: ?string, cabecalho?: ?string, corpo?: ?string, rodape?: ?string,
     *               template_capa?: ?string, template_documento?: ?string,
     *               marca_dagua_capa?: ?string, marca_dagua_documento?: ?string}  $dados
     */
    public function documento(array $dados): string
    {
        $mpdf = $this->novoMpdf();
        $mpdf->setAutoTopMargin = 'stretch';
        $mpdf->setAutoBottomMargin = 'stretch';

        $cabecalho = (string) ($dados['cabecalho'] ?? '');
        $rodape = (string) ($dados['rodape'] ?? '');
        $capa = (string) ($dados['capa'] ?? '');

        // Capa
        $this->aplicarFundo($mpdf, $this->templates->caminhoAbsoluto($dados['template_capa'] ?? null, 'capa'));
        $this->aplicarMarcaDagua($mpdf, $dados['marca_dagua_capa'] ?? null);

        if ($capa !== '') {
            $mpdf->WriteHTML($capa);
            $mpdf->SetHTMLHeader($cabecalho);
            $mpdf->AddPage();
        } else {
            $mpdf->SetHTMLHeader($cabecalho);
        }
        $mpdf->SetHTMLFooter($rodape);

        // Documento
        $this->aplicarFundo($mpdf, $this->templates->caminhoAbsoluto($dados['template_documento'] ?? null, 'documento'));
        $this->aplicarMarcaDagua($mpdf, $dados['marca_dagua_documento'] ?? null);

        $mpdf->WriteHTML((string) ($dados['corpo'] ?? ''));

        return $mpdf->Output('', 'S');
    }

    public function capa(?string $html): string
    {
        $mpdf = $this->novoMpdf();
        $mpdf->WriteHTML((string) $html);

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
