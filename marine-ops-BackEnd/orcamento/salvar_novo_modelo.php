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

$conteudo_cabecalho = $data['conteudo_cabecalho'];
$conteudo_corpo = $data['conteudo_corpo'];
$conteudo_rodape = $data['conteudo_rodape'];
$nomeModelo = $data['nome_modelo'];

$sql = 
"
INSERT INTO 
modelo_orcamento 
(codigo_usuario, nome, criado_em_data, criado_em_hora, atualizado_em, conteudo_cabecalho, conteudo_corpo, conteudo_rodape) 
VALUES 
('$codigo_usuario','$nomeModelo','$data_atual','$hora_atual','$atualizado_em','$conteudo_cabecalho','$conteudo_corpo','$conteudo_rodape')";

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