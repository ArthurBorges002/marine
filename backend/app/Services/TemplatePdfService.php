<?php

namespace App\Services;

use App\Models\TemplatePdf;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

/**
 * Imagens de papel timbrado usadas como fundo da capa e das páginas do PDF.
 */
class TemplatePdfService
{
    public function salvar(UploadedFile $arquivo, string $nome, string $tipo): TemplatePdf
    {
        return TemplatePdf::create([
            'tipo' => $tipo,
            'nome' => $nome,
            'arquivo' => uniqid().'_'.(Str::slug($nome, '_') ?: 'template'),
            'extensao' => strtolower($arquivo->getClientOriginalExtension() ?: $arquivo->extension()),
            'conteudo_base64' => base64_encode($arquivo->getContent()),
        ]);
    }

    /**
     * Caminho de um arquivo local com a imagem (o mPDF precisa de um caminho),
     * ou null se o template não existir. O arquivo é um cache temporário.
     */
    public function caminhoAbsoluto(?string $identificador, string $tipo): ?string
    {
        if (! $identificador) {
            return null;
        }

        $template = TemplatePdf::where('arquivo', $identificador)->where('tipo', $tipo)->first();
        if (! $template || ! $template->conteudo_base64) {
            return null;
        }

        $diretorio = storage_path('app/mpdf/templates');
        if (! is_dir($diretorio)) {
            mkdir($diretorio, 0775, true);
        }

        $caminho = "{$diretorio}/{$template->arquivo}.{$template->extensao}";
        if (! is_file($caminho)) {
            file_put_contents($caminho, $template->conteudo());
        }

        return $caminho;
    }
}
