<?php

namespace App\Http\Requests;

use App\Models\Orcamento;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrcamentoStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(Orcamento::STATUS)],
        ];
    }
}
