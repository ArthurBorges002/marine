<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$sql = "SELECT max(codigo) FROM orcamento";
$consulta = mysqli_query($conexao,$sql);
$resultado = mysqli_fetch_row($consulta);

$proximo_num = $resultado[0] + 1;

echo json_encode($proximo_num);

?>