<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Pré-visualização em PDF do conteúdo que está nos editores (ainda não salvo).
 */
class PdfController extends Controller
{
    public function documento(Request $request, PdfService $pdf): Response
    {
        $dados = $request->validate([
            'capa' => ['nullable', 'string'],
            'cabecalho' => ['nullable', 'string'],
            'corpo' => ['nullable', 'string'],
            'rodape' => ['nullable', 'string'],
            'template_capa_pdf' => ['nullable', 'string'],
            'template_doc_pdf' => ['nullable', 'string'],
            'marca_d_agua_capa' => ['nullable', 'string'],
            'marca_d_agua_documento' => ['nullable', 'string'],
            'marca_d_agua_doc' => ['nullable', 'string'],
        ]);

        return self::respostaPdf($pdf->documento([
            'capa' => $dados['capa'] ?? null,
            'cabecalho' => $dados['cabecalho'] ?? null,
            'corpo' => $dados['corpo'] ?? null,
            'rodape' => $dados['rodape'] ?? null,
            'template_capa' => $dados['template_capa_pdf'] ?? null,
            'template_documento' => $dados['template_doc_pdf'] ?? null,
            'marca_dagua_capa' => $dados['marca_d_agua_capa'] ?? null,
            'marca_dagua_documento' => $dados['marca_d_agua_documento'] ?? $dados['marca_d_agua_doc'] ?? null,
        ]));
    }

    public function capa(Request $request, PdfService $pdf): Response
    {
        $dados = $request->validate(['capa' => ['nullable', 'string']]);

        return self::respostaPdf($pdf->capa($dados['capa'] ?? null));
    }

    public static function respostaPdf(string $conteudo, string $nomeArquivo = 'orcamento.pdf'): Response
    {
        return response($conteudo, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$nomeArquivo.'"',
        ]);
    }
}
