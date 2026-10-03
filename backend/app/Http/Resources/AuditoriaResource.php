<?php

namespace App\Http\Resources;

use App\Models\Auditoria;
use App\Models\ConfiguracaoCadastro;
use App\Models\ContaPagar;
use App\Models\ContaReceber;
use App\Models\Equipamento;
use App\Models\FluxoCaixa;
use App\Models\Funcionario;
use App\Models\FuncionarioCertificacao;
use App\Models\Organizacao;
use App\Models\Perfil;
use App\Models\Projeto;
use App\Models\TemplatePdf;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Auditoria */
class AuditoriaResource extends JsonResource
{
    /** Identificador usado no filtro => classe e nome exibido. */
    public const ENTIDADES = [
        'funcionario' => ['classe' => Funcionario::class, 'nome' => 'Funcionário'],
        'certificacao' => ['classe' => FuncionarioCertificacao::class, 'nome' => 'Certificação'],
        'projeto' => ['classe' => Projeto::class, 'nome' => 'Projeto'],
        'equipamento' => ['classe' => Equipamento::class, 'nome' => 'Equipamento'],
        'conta_pagar' => ['classe' => ContaPagar::class, 'nome' => 'Conta a pagar'],
        'conta_receber' => ['classe' => ContaReceber::class, 'nome' => 'Conta a receber'],
        'fluxo_caixa' => ['classe' => FluxoCaixa::class, 'nome' => 'Fluxo de caixa'],
        'configuracao_cadastro' => ['classe' => ConfiguracaoCadastro::class, 'nome' => 'Configuração de cadastro'],
        'papel_timbrado' => ['classe' => TemplatePdf::class, 'nome' => 'Papel timbrado'],
        'usuario' => ['classe' => Usuario::class, 'nome' => 'Usuário'],
        'perfil' => ['classe' => Perfil::class, 'nome' => 'Perfil'],
        'organizacao' => ['classe' => Organizacao::class, 'nome' => 'Organização'],
    ];

    public function toArray(Request $request): array
    {
        $entidade = collect(self::ENTIDADES)->search(fn ($e) => $e['classe'] === $this->auditavel_type);

        return [
            'id' => $this->id,
            'acao' => $this->acao,
            'entidade' => $entidade ?: null,
            'entidadeNome' => $entidade ? self::ENTIDADES[$entidade]['nome'] : null,
            'registroId' => $this->auditavel_id,
            'usuario' => $this->usuario ? ['id' => $this->usuario->id, 'nome' => $this->usuario->nome] : null,
            'antes' => $this->antes,
            'depois' => $this->depois,
            'ip' => $this->ip,
            'em' => $this->created_at?->toIso8601String(),
        ];
    }
}
