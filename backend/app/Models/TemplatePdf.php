<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

/**
 * Imagem de papel timbrado usada como fundo da capa/documento no PDF.
 * "arquivo" é o identificador guardado no orçamento; a imagem fica no banco.
 */
#[Table('templates_pdf')]
#[Fillable(['tipo', 'nome', 'arquivo', 'extensao', 'conteudo_base64'])]
#[Hidden(['conteudo_base64'])]
class TemplatePdf extends Model
{
    public const MIME_TYPES = [
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
    ];

    public function conteudo(): string
    {
        return base64_decode((string) $this->conteudo_base64);
    }

    public function mimeType(): string
    {
        return self::MIME_TYPES[$this->extensao] ?? 'application/octet-stream';
    }
}
