<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TemplatePdfRequest;
use App\Models\TemplatePdf;
use App\Services\TemplatePdfService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TemplatePdfController extends Controller
{
    public function capas(): JsonResponse
    {
        return response()->json($this->listar('capa')->map(fn (TemplatePdf $t) => [
            'id' => $t->id,
            'nome_template_capa_arquivo' => $t->arquivo,
            'nome_template_capa' => $t->nome,
            'url' => route('templates-pdf.imagem', $t->arquivo),
        ]));
    }

    public function documentos(): JsonResponse
    {
        return response()->json($this->listar('documento')->map(fn (TemplatePdf $t) => [
            'id' => $t->id,
            'template_doc_nome_arquivo' => $t->arquivo,
            'template_doc_nome' => $t->nome,
            'url' => route('templates-pdf.imagem', $t->arquivo),
        ]));
    }

    public function store(TemplatePdfRequest $request, TemplatePdfService $templates): JsonResponse
    {
        $template = $templates->salvar(
            $request->file('arquivo'),
            $request->validated('nomeModelo'),
            $request->tipoTemplate(),
        );

        return response()->json(['status' => 'sucesso', 'arquivo' => $template->arquivo], 201);
    }

    /**
     * Imagem do template. Rota pública porque é usada diretamente em CSS
     * (background-image) na pré-visualização, onde não há cabeçalho Authorization.
     */
    public function imagem(string $arquivo): Response
    {
        $template = TemplatePdf::where('arquivo', $arquivo)->whereNotNull('conteudo_base64')->firstOrFail();

        return response($template->conteudo(), 200, [
            'Content-Type' => $template->mimeType(),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    private function listar(string $tipo)
    {
        return TemplatePdf::where('tipo', $tipo)->orderBy('id')->get();
    }
}
