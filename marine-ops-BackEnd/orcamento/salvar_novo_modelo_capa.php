<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$codigo_usuario = 1;
$data_atual = date("Y-m-d");
$hora_atual = date("H:i:s");
$atualizado_em = $data_atual . " às " . $hora_atual . " por Arthur";

$data = json_decode(file_get_contents("php://input"), true);

$conteudoCapa = $data['conteudo_capa'];
$nomeModeloCapa = $data['nome_modelo_capa'];

$sql = 
"
INSERT INTO 
modelo_capa 
(codigo_usuario, nome, criado_em_data, criado_em_hora, atualizado_em, conteudo_capa) 
VALUES 
('$codigo_usuario','$nomeModeloCapa','$data_atual','$hora_atual','$atualizado_em','$conteudoCapa')";

$consulta = mysqli_query($conexao, $sql);

if ($consulta) {
    echo json_encode(["status" => "Certo"]);
} else {
    echo json_encode([
        "status" => "Errado",
        "erro" => mysqli_error($conexao)
    ]);
}


?>