<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$sql = "SELECT codigo, nome FROM modelo_orcamento";
$resultado = mysqli_query($conexao, $sql);

$modelos = [];

while($row = mysqli_fetch_assoc($resultado)){
    $modelos[] = $row;
}

echo json_encode($modelos);

/*
Isso vai retornar algo como:

[
  {"codigo": 1, "nome": "Padrão"},
  {"codigo": 2, "nome": "Comercial"}
]
*/

?>