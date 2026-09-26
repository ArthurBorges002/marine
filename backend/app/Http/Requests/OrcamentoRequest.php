<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaEntrada;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Criação e edição de orçamento. Os nomes dos campos são os que o frontend já envia.
 */
class OrcamentoRequest extends FormRequest
{
    use NormalizaEntrada;

    protected function prepareForValidation(): void
    {
        $this->merge([
            'codigo_modelo' => $this->vazioParaNull($this->input('codigo_modelo')),
            'capa_orc' => $this->vazioParaNull($this->input('capa_orc')),
            'estado' => $this->vazioParaNull($this->input('estado')),
            'cidade' => $this->vazioParaNull($this->input('cidade')),
            'template_selecionado_capa' => $this->vazioParaNull($this->input('template_selecionado_capa')),
            'template_selecionado_documento' => $this->vazioParaNull($this->input('template_selecionado_documento')),
            'valor_total' => $this->normalizarDecimal($this->input('valor_total')),
        ]);
    }

    public function rules(): array
    {
        return [
            'nome_cliente' => ['required', 'string', 'max:255'],
            'estado' => ['nullable', 'string', 'size:2'],
            'cidade' => ['nullable', 'string', 'max:120'],
            'info_complementar' => ['nullable', 'string'],
            'valor_total' => ['nullable', 'numeric', 'min:0'],
            'codigo_modelo' => ['nullable', 'integer', 'exists:modelos_orcamento,id'],
            'capa_orc' => ['nullable', 'integer', 'exists:modelos_capa,id'],
            'template_selecionado_capa' => ['nullable', 'string', 'exists:templates_pdf,arquivo'],
            'template_selecionado_documento' => ['nullable', 'string', 'exists:templates_pdf,arquivo'],
            'marca_d_agua_capa' => ['nullable', 'string', 'max:255'],
            'marca_d_agua_documento' => ['nullable', 'string', 'max:255'],
            'capa_conteudo' => ['nullable', 'string'],
            'cabecalho' => ['nullable', 'string'],
            'corpo' => ['nullable', 'string'],
            'rodape' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nome_cliente' => 'nome do cliente',
            'codigo_modelo' => 'modelo de orçamento',
            'capa_orc' => 'modelo de capa',
        ];
    }

    /** Mapeia o payload para as colunas da tabela orcamentos. */
    public function dadosOrcamento(): array
    {
        $dados = $this->validated();

        return [
            'nome_cliente' => $dados['nome_cliente'],
            'estado' => $dados['estado'] ?? null,
            'cidade' => $dados['cidade'] ?? null,
            'info_complementar' => $dados['info_complementar'] ?? null,
            'valor_total' => $dados['valor_total'] ?? 0,
            'modelo_orcamento_id' => $dados['codigo_modelo'] ?? null,
            'modelo_capa_id' => $dados['capa_orc'] ?? null,
            'template_capa' => $dados['template_selecionado_capa'] ?? null,
            'template_documento' => $dados['template_selecionado_documento'] ?? null,
            'marca_dagua_capa' => $dados['marca_d_agua_capa'] ?? null,
            'marca_dagua_documento' => $dados['marca_d_agua_documento'] ?? null,
            'capa' => $dados['capa_conteudo'] ?? null,
            'cabecalho' => $dados['cabecalho'] ?? null,
            'corpo' => $dados['corpo'] ?? null,
            'rodape' => $dados['rodape'] ?? null,
        ];
    }
}
