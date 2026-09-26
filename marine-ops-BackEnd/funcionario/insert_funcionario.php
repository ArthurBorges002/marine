<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$nomeCompleto = $_POST['nome_completo'] ?? "";
$dataNascimento = $_POST['data_nascimento'] ?? "";
$cpf = $_POST['cpf'] ?? "";
$rg = $_POST['rg'] ?? "";
$genero = $_POST['genero'] ?? "";
$estadoCivil = $_POST['estado_civil'] ?? "";
$nacionalidade = $_POST['nacionalidade'] ?? "";
$estado = $_POST['estado'] ?? "";
$cidade = $_POST['cidade'] ?? "";
$cep = $_POST['cep'] ?? "";
$logradouro = $_POST['logradouro'] ?? "";
$complemento = $_POST['complemento'] ?? "";
$numero = $_POST['numero'] ?? "";
$bairro = $_POST['bairro'] ?? "";
$telefone1 = $_POST['telefone1'] ?? "";
$telefone2 = $_POST['telefone2'] ?? "";
$email = $_POST['email'] ?? "";
$funcaoCargo = $_POST['funcao_cargo'] ?? "";
$departamentoSetor = $_POST['departamento_setor'] ?? "";
$tipoContrato = $_POST['tipo_contrato'] ?? "";
$salarioBase = $_POST['salario_base'] ?? "";

$cadastro = date('Y-m-d');

$sql = "
    INSERT INTO funcionario
    (nome, data_nascimento, cpf, rg, genero, estado_civil, nacionalidade, estado, cidade, cep, logradouro, complemento, numero, bairro, funcao_cargo, departamento_setor, tipo_contrato, salario_base, telefone_principal, telefone_secundario, email, data_cadastro, ultima_atualizacao, ativo)
    VALUES 
    ('$nomeCompleto','$dataNascimento','$cpf','$rg','$genero','$estadoCivil','$nacionalidade','$estado','$cidade','$cep','$logradouro','$complemento','$numero','$bairro','$funcaoCargo','$departamentoSetor','$tipoContrato','$salarioBase','$telefone1','$telefone2','$email','$cadastro','$cadastro', 'A')";

$consulta = mysqli_query($conexao, $sql);

if($consulta){
    echo json_encode(["msg" => "Sucesso"]);
}else{
    echo json_encode(["msg" => $conexao->error]);
}

?>