<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$data = json_decode(file_get_contents("php://input"), true);

// Partes do Orçamento 
$orcCapaCodigo = $data['capa_orc'] ?? "";
$orcCapa = $data["capa_conteudo"] ?? "";
$orcCabecalho = $data['cabecalho'] ?? "";
$orcCorpo = $data['corpo'] ?? "";
$orcRodape = $data['rodape'] ?? "";

// Template CAPA e DOCUMENTO
$templateSelecionadoDoc = $data["template_selecionado_documento"] ?? "";
$marcaDAguaDoc = $data["marca_d_agua_documento"] ?? "";
$templateSelecionadoCapa = $data["template_selecionado_capa"] ?? "";
$marcaDAguaCapa = $data["marca_d_agua_capa"] ?? "";

// Informações (Escapar)
$nomeCliente = $data['nome_cliente'] ?? "";
$estadoOrcamento = $data['estado'] ?? "";
$cidadeOrcamento = $data['cidade'] ?? "";
$infoComplementar = $data['info_complementar'] ?? "";
$codigoModelo = $data['codigo_modelo'] ?? "";
$valorTotal = $data['valor_total'] ?? "";

$codigoUsuario = $data['codigo_usuario'] ?? "";
// Pegando o nome do usuário
$sql = "SELECT nome FROM usuario where codigo = $codigoUsuario";
$consulta = mysqli_query($conexao, $sql);
$resultado = mysqli_fetch_row($consulta);
$nomeUsuario = $resultado[0];

// Setando outras informações
$dataAtual = date("Y-m-d");
$horaAtual = date("H:i:s");
$ultimaEdicaoEm = $dataAtual . " às " . $horaAtual . " por " . $nomeUsuario;
$status = "E"; // Em analise

$sql = "SELECT MAX(codigo) FROM orcamento";
$consulta = mysqli_query($conexao, $sql);
$resultado = mysqli_fetch_row($consulta);

$proximo_numero = $resultado[0] + 1;
$codigo_interno = "ORC-" . date("Y") . "-" . str_pad($proximo_numero, 4, "0", STR_PAD_LEFT);


// Inserindo o orçamento na tabela
$sql = "
INSERT INTO orcamento (codigo_interno, codigo_modelo, codigo_usuario, codigo_capa, template_selecionado_capa, template_selecionado_documento, nome_cliente, estado, cidade, info_complementar, valor_total, criado_em_data, criado_em_hora, ultima_edicao_em, status, capa, cabecalho, corpo, rodape,marcaDAgua_capa, marcaDAgua_documento) 
VALUES
('$codigo_interno','$codigoModelo','$codigoUsuario','$orcCapaCodigo','$templateSelecionadoCapa','$templateSelecionadoDoc','$nomeCliente','$estadoOrcamento','$cidadeOrcamento','$infoComplementar','$valorTotal','$dataAtual','$horaAtual','$ultimaEdicaoEm','$status','$orcCapa','$orcCabecalho','$orcCorpo','$orcRodape','$marcaDAguaCapa','$marcaDAguaDoc')";
$consulta = mysqli_query($conexao, $sql);

if ($consulta) {
    echo json_encode(["status" => "Certo"]);
} else {
    echo json_encode([
        "status" => "Errado",
        "erro" => mysqli_error($conexao)
    ]);
}

?>