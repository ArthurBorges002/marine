<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$codigo = $_GET['codigo'];

$sql = "SELECT * FROM funcionario WHERE codigo = '$codigo'";
$consuta = mysqli_query($conexao, $sql);
$resultado = mysqli_fetch_array($consuta);

echo json_encode([
    "nome" => $resultado['nome'],
    "data_nascimento" => $resultado['data_nascimento'],
    "cpf" => $resultado['cpf'],
    "rg" => $resultado['rg'],
    "genero" => $resultado['genero'],
    "estado_civil" => $resultado['estado_civil'],
    "nacionalidade" => $resultado['nacionalidade'],
    "estado" => $resultado['estado'],
    "cidade" => $resultado['cidade'],
    "cep" => $resultado['cep'],
    "logradouro" => $resultado['logradouro'],
    "complemento" => $resultado['complemento'],
    "numero" => $resultado['numero'],
    "bairro" => $resultado['bairro'],
    "funcao_cargo" => $resultado['funcao_cargo'],
    "departamento_setor" => $resultado['departamento_setor'],
    "contrato" => $resultado['tipo_contrato'],
    "salario_base" => $resultado['salario_base'],
    "telefone_principal" => $resultado['telefone_principal'],
    "telefone_secundario" => $resultado['telefone_secundario'],
    "email" => $resultado['email'],
    "data_cadastro" => $resultado['data_cadastro'],
    "ultima_atualizacao" => $resultado['ultima_atualizacao'],
    "ativo" => $resultado['ativo']
]);

?>