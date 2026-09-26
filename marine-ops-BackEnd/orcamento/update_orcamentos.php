<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

$data = json_decode(file_get_contents("php://input"), true);

$codigoOrcamento = $data["codigo_orcamento"];
$novoCabecalho = $data["cabecalho"] ?? "";
$novoCorpo = $data["corpo"] ?? "";
$novoRodape = $data["rodape"] ?? "";
$novoCodigoModelo = $data["codigo_modelo"] ?? "";
$novoCodigoUsuario = $data["codigo_usuario"] ?? "";
$novoNomeCliente = $data["nome_cliente"] ?? "";
$novoEstado = $data["estado"] ?? "";
$novaCidade = $data["cidade"] ?? "";
$novaInfoComplementar = $data["info_complementar"] ?? "";
$novoValorTotal = $data["valor_total"] ?? "";
$novaCapaOrc = $data["capa_orc"] ?? "";
$novaMarcaDAguaCapa = $data["marca_d_agua_capa"] ?? "";
$novoTemplateSelecionadoCapa = $data["template_selecionado_capa"] ?? "";
$novaMarcaDAguaDocumento = $data["marca_d_agua_documento"] ?? "";
$novoTemplateSelecionadoDocumento = $data["template_selecionado_documento"];

$data = date("Y-m-d");
$time = date("H:i:s");
$sql = 
"
SELECT codigo, nome FROM usuario WHERE codigo = '$novoCodigoUsuario'
";
$consulta = mysqli_query($conexao, $sql);
$resultado = mysqli_fetch_row($consulta);
/*
mysqli_fetch_row retorna algo como:
array(2) {
  [0]=>
  string(1) "1"
  [1]=>
  string(5) "admin"
}
*/
$nomeUsuarioQueAlterou = $resultado[1];
$ultimaEdicaoEm = $data . " às " . $time . " por " . $nomeUsuarioQueAlterou;

$sql = 
"
UPDATE orcamento SET cabecalho = '$novoCabecalho', corpo = '$novoCorpo', rodape = '$novoRodape', nome_cliente = '$novoNomeCliente', estado = '$novoEstado', cidade = '$novaCidade', info_complementar = '$novaInfoComplementar', valor_total = '$novoValorTotal', codigo_capa = '$novaCapaOrc', marcaDAgua_capa = '$novaMarcaDAguaCapa', template_selecionado_capa = '$novoTemplateSelecionadoCapa', marcaDAgua_documento = '$novaMarcaDAguaDocumento',template_selecionado_documento = '$novoTemplateSelecionadoDocumento', ultima_edicao_em = '$ultimaEdicaoEm' where codigo = '$codigoOrcamento';
";
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