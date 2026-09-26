<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$data = json_decode(file_get_contents("php://input"), true);

$novoStatus = $data['novoStatus'];
$codigoOrcamento = $data['codigoOrcamento'];

$sql = "UPDATE orcamento SET status = '$novoStatus' WHERE codigo = $codigoOrcamento";
$consulta = mysqli_query($conexao, $sql);

if($consulta){
    echo json_encode(["status" => "Certo"]);
}else{
    echo json_encode([
        "status" => "Erro", 
        "erro" => mysqli_error($conexao) 
    ]);
}

?>