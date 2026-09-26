<?php

// Mensagens das regras de validação usadas pela API.
// Regras não listadas aqui usam a mensagem padrão (em inglês) do framework.
return [
    'array' => 'O campo :attribute deve ser uma lista.',
    'before' => 'O campo :attribute deve ser uma data anterior a :date.',
    'boolean' => 'O campo :attribute deve ser verdadeiro ou falso.',
    'date' => 'O campo :attribute não é uma data válida.',
    'email' => 'O campo :attribute deve ser um e-mail válido.',
    'exists' => 'O valor selecionado para :attribute é inválido.',
    'file' => 'O campo :attribute deve ser um arquivo.',
    'in' => 'O valor selecionado para :attribute é inválido.',
    'integer' => 'O campo :attribute deve ser um número inteiro.',
    'max' => [
        'file' => 'O arquivo :attribute não pode ser maior que :max kilobytes.',
        'numeric' => 'O campo :attribute não pode ser maior que :max.',
        'string' => 'O campo :attribute não pode ter mais que :max caracteres.',
    ],
    'mimes' => 'O arquivo :attribute deve ser do tipo: :values.',
    'min' => [
        'numeric' => 'O campo :attribute deve ser no mínimo :min.',
        'string' => 'O campo :attribute deve ter no mínimo :min caracteres.',
    ],
    'numeric' => 'O campo :attribute deve ser um número.',
    'required' => 'O campo :attribute é obrigatório.',
    'size' => [
        'string' => 'O campo :attribute deve ter :size caracteres.',
    ],
    'string' => 'O campo :attribute deve ser um texto.',
    'unique' => 'Já existe um registro com este :attribute.',

    'attributes' => [
        'email' => 'e-mail',
        'senha' => 'senha',
        'cpf' => 'CPF',
        'estado' => 'estado',
        'cidade' => 'cidade',
        'valor_total' => 'valor total',
        'salario_base' => 'salário base',
        'data_nascimento' => 'data de nascimento',
        'arquivo' => 'arquivo',
        'status' => 'status',
    ],
];
