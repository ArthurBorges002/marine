<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if(isset($_FILES['arquivo'])){

    $arquivo = $_FILES['arquivo'];
    $nomeArquivo = $_POST['nomeModelo'];
    $extensao = pathinfo($arquivo['name'], PATHINFO_EXTENSION);

    $nome = uniqid() . "_" . $nomeArquivo . "." . $extensao;
 
    $tipo = $_POST['tipo'];
    $nome_modelo = $_POST['nomeModelo'];
    
    if($tipo == "capa") $caminho = __DIR__ . "/imagens_templates_pdf/templates_capas/" . $nome;
    if($tipo == "doc") $caminho = __DIR__ . "/imagens_templates_pdf/templates_docs/" . $nome;

    if(move_uploaded_file($arquivo['tmp_name'], $caminho)){
        echo json_encode(["status" => "sucesso", "arquivo" => $nome]);
    }else{
        echo json_encode(["status" => "erro", "mensagem" => "Falha ao mover arquivo"]);
    }
}else{
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum arquivo recebido"]);
}

?>