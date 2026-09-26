<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

if(isset($_GET["codigo"])){

    $codigo_orcamento = $_GET["codigo"];

    // Excluindo o Orçamento
    $sql = "DELETE FROM orcamento WHERE codigo = $codigo_orcamento";
    $consulta = mysqli_query($conexao,$sql);
    
    if($consulta){
        echo json_encode(["status" => "Certo"]);
    }else{
        echo json_encode(["status" => "Erro"]);
    }

}

?>