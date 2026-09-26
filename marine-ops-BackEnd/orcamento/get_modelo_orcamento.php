<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

if(isset($_GET['codigo_modelo'])){

    $codigo_modelo = $_GET['codigo_modelo'];

    $sql = "SELECT nome, conteudo_cabecalho, conteudo_corpo, conteudo_rodape FROM modelo_orcamento WHERE codigo = $codigo_modelo";
    $consulta = mysqli_query($conexao, $sql);

    $resultado = mysqli_fetch_row($consulta);

    if($resultado){
        $resultado = [
            "nome" => $resultado[0],
            "cabecalho" => $resultado[1],
            "corpo" => $resultado[2],
            "rodape" => $resultado[3]
        ];
    }

}

echo json_encode($resultado)

?>