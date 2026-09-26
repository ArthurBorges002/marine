<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../conecta.php";

// Pegando parâmetros do frontend
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 4;
$offset = ($page - 1) * $limit;

// Filtros
$search = isset($_GET['search']) ? $_GET['search'] : '';
$status = isset($_GET['status']) ? $_GET['status'] : '';
$data_inicial = isset($_GET['data_inicial']) ? $_GET['data_inicial'] : '';
$data_final = isset($_GET['data_final']) ? $_GET['data_final'] : '';

// 1 - FILTRO DE BUSCA
if (!empty($search)) {
    $search = mysqli_real_escape_string($conexao, $search);
    $add1 = 
    "
        WHERE (nome_cliente LIKE '%$search%' 
        OR codigo_interno LIKE '%$search%' 
        OR cidade LIKE '%$search%')
    ";
    $and_where = "and";
}else{
    $add1 = "";
    $and_where = "WHERE";
}

// 2 - FILTRO DE STATUS
if(!empty($status) && $status != "T"){
    $add2 = 
    "
        $and_where status = '$status'
    ";
    $and_where = "and";
}else{
    $add2 = "";

    if(empty($search) && (empty($status)) || $status == "T"){
        $and_where = "WHERE";
    }
}

// 3 - FILTRO DE DATA
if(!empty($data_inicial) && !empty($data_final)){

    $add3 = 
    "
        $and_where criado_em_data BETWEEN '$data_inicial' AND '$data_final' 
    ";

}else{
    $add3 = "";
}


// CONSULTA PRINCIPAL
$sql = "
SELECT codigo, codigo_interno, nome_cliente, cidade, estado, info_complementar, valor_total, criado_em_data, status  
FROM orcamento
$add1 $add2 $add3
ORDER BY codigo DESC
LIMIT $limit OFFSET $offset
";

$consulta = mysqli_query($conexao, $sql);

$resultado = [];
while ($row = mysqli_fetch_assoc($consulta)) {
    $resultado[] = $row;
}

// Verifica se há mais registros
$totalSql = "SELECT COUNT(*) as total FROM orcamento $add1 $add2 $add3";
$totalConsulta = mysqli_query($conexao, $totalSql);
$total = mysqli_fetch_assoc($totalConsulta)['total'];

$hasMore = $page * $limit < $total;

echo json_encode([
    "data" => $resultado,
    "hasMore" => $hasMore
]);

?>