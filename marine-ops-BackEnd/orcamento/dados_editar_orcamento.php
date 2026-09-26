<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

if(isset($_GET["codigo"])){

    $codigo_orcamento = $_GET["codigo"];

    $sql = 
    "
    SELECT 
    orc.codigo_modelo, orc.template_selecionado_capa , orc.template_selecionado_documento ,orc.nome_cliente, orc.estado, orc.cidade,orc.info_complementar, orc.valor_total, orc.cabecalho, orc.corpo, orc.rodape, orc.marcaDAgua_capa ,orc.marcaDAgua_documento, capa.conteudo_capa, capa.codigo
    FROM orcamento AS orc
    JOIN modelo_capa AS capa
    ON orc.codigo_capa = capa.codigo
    WHERE orc.codigo = $codigo_orcamento
    ";
    $consulta = mysqli_query($conexao, $sql);
    $resultado = mysqli_fetch_assoc($consulta);

    if($resultado){

        echo json_encode
        ([
            "codigo_modelo" => $resultado["codigo_modelo"],
            "nome_cliente" => $resultado["nome_cliente"],
            "estado" => $resultado["estado"],
            "cidade" => $resultado["cidade"],
            "info_complementar" => $resultado["info_complementar"],
            "valor_total" => $resultado["valor_total"],
            "cabecalho" => $resultado["cabecalho"],
            "corpo" => $resultado["corpo"],
            "rodape" => $resultado["rodape"],
            "conteudo_capa" => $resultado["conteudo_capa"],
            "codigo_capa" => $resultado["codigo"],
            "template_selecionado_documento" => $resultado["template_selecionado_documento"],
            "marca_d_agua_documento" => $resultado["marcaDAgua_documento"],
            "template_selecionado_capa" => $resultado["template_selecionado_capa"],
            "marca_d_agua_capa" => $resultado["marcaDAgua_capa"]
        ]);

    }
        

}


?>