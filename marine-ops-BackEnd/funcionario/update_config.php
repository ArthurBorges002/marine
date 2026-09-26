<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$data = json_decode(file_get_contents("php://input"), true);

$tela = $data['tela'] ?? "";
$config = json_encode($data['config'] ?? "", JSON_UNESCAPED_UNICODE);

$sql = "UPDATE configuracao_cadastro SET configuracao = '$config' WHERE codigo = '$tela'";
$consulta = mysqli_query($conexao, $sql);

if($consulta){
    echo json_encode(["status" => "Certo"]);
}else{
    echo json_encode(["status" => "Erro"]);
}

?>