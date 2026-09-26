<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

if(isset($_GET['codigo_capa'])){

    $codigo_capa = $_GET['codigo_capa'];

    $sql = "SELECT nome, conteudo_capa FROM modelo_capa WHERE codigo = $codigo_capa";
    $consulta = mysqli_query($conexao, $sql);

    $resultado = mysqli_fetch_row($consulta);

    if($resultado){
         echo json_encode(["nome" => $resultado[0], "capa" => $resultado[1]]);
    }

}

?>