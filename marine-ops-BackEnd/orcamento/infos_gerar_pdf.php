<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$infos = [];

if(isset($_GET['codigo'])){

    $codigo = $_GET['codigo'];

    $sql = 
    "
    SELECT template_selecionado_capa, template_selecionado_documento, capa, cabecalho, corpo, rodape, marcaDAgua_capa, marcaDAgua_documento
    FROM orcamento 
    WHERE codigo = '$codigo';
    ";
    $consulta = mysqli_query($conexao, $sql);
    $resultado = mysqli_fetch_assoc($consulta);

    if($resultado){

        echo json_encode([
            'template_selecionado_capa' => $resultado["template_selecionado_capa"],
            'template_selecionado_documento' => $resultado["template_selecionado_documento"],
            'capa' => $resultado["capa"],
            'cabecalho' => $resultado["cabecalho"],
            'corpo' => $resultado["corpo"],
            'rodape' => $resultado["rodape"],
            'marcaDAgua_capa' => $resultado["marcaDAgua_capa"],
            'marcaDAgua_documento' => $resultado["marcaDAgua_documento"]
        ]);

    }


}


?>