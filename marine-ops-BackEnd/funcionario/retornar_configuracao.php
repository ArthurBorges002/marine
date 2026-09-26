<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$sql = "SELECT configuracao FROM configuracao_cadastro WHERE codigo = '1'";
$consulta = mysqli_query($conexao, $sql);
$resultado = mysqli_fetch_row($consulta);

echo $resultado[0];

?>