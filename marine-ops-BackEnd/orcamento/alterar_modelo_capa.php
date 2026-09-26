<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$data = json_decode(file_get_contents("php://input"), true);

$novaCapa = $data["capa_alterado_editar"] ?? "";
$novoNome = $data["nome_capa_editar"] ?? "";
$codigoAlterar = $data["codigo_capa_editar"] ?? "";

$data = date("Y-m-d");
$time = date("H:i:s");

// Codigo Usuário (Alterar para o certo);
$codigoUsuario = 1;

$sql = 
"
SELECT codigo,nome FROM usuario WHERE codigo = '$codigoUsuario';
";
$consulta = mysqli_query($conexao, $sql);
$resultado = mysqli_fetch_row($consulta);
/*
mysqli_fetch_row retorna algo como:
array(2) {
  [0]=>
  string(1) "1"
  [1]=>
  string(5) "admin"
}
*/
$nomeUsuario = $resultado[1];

$atualizadoEm =  $data . " às " . $time . " por " . $nomeUsuario;

$sql = 
"
UPDATE modelo_capa SET conteudo_capa = '$novaCapa', nome = '$novoNome', atualizado_em = '$atualizadoEm' WHERE codigo = '$codigoAlterar';
";
$consulta = mysqli_query($conexao, $sql);

if($consulta){
    echo json_encode(["status" => "Certo"]);
}else{
    echo json_encode(["status" => "Errado", "erro" => mysqli_error($conexao)]);
}


?>