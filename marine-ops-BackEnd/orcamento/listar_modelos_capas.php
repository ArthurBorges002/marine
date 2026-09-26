<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$sql = "SELECT codigo,nome FROM modelo_capa";
$resultado = mysqli_query($conexao, $sql);

$modelo_capa = [];

while($row = mysqli_fetch_assoc($resultado)){
    $modelo_capa[] = $row;
}


echo json_encode($modelo_capa);

/*
Isso vai retornar algo como:

[
  {"codigo": 1, "nome": "Padrão"},
  {"codigo": 2, "nome": "Comercial"}
]
*/

?>