<?php

namespace App\Http\Resources;

use App\Models\Orcamento;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Dados para a tela de edição de orçamento
 * (mesmas chaves que o endpoint antigo dados_editar_orcamento.php).
 *
 * @mixin Orcamento
 */
class OrcamentoDetalheResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'codigo' => $this->id,
            'codigo_interno' => $this->codigo_interno,
            // Os selects do frontend trabalham com strings
            'codigo_modelo' => $this->modelo_orcamento_id ? (string) $this->modelo_orcamento_id : '',
            'codigo_capa' => $this->modelo_capa_id ? (string) $this->modelo_capa_id : '',
            'nome_cliente' => $this->nome_cliente,
            'estado' => $this->estado,
            'cidade' => $this->cidade,
            'info_complementar' => $this->info_complementar,
            'valor_total' => $this->valor_total,
            'cabecalho' => $this->cabecalho,
            'corpo' => $this->corpo,
            'rodape' => $this->rodape,
            'conteudo_capa' => $this->capa ?? $this->modeloCapa?->conteudo,
            'template_selecionado_documento' => $this->template_documento,
            'marca_d_agua_documento' => $this->marca_dagua_documento,
            'template_selecionado_capa' => $this->template_capa,
            'marca_d_agua_capa' => $this->marca_dagua_capa,
        ];
    }
}
