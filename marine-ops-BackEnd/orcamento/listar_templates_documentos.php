<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Caminho no servidor para a pasta onde estão os templates dos documentos
$dir = __DIR__ . '/../imagens_templates_pdf/templates_docs';

$resultado = [];

// Verifica se o caminho físico existe e é uma pasta. Se não existir, retorna um JSON de erro e encerra a execução.
if (!is_dir($dir)) {
    echo json_encode(['error' => 'Pasta não encontrada'], JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
    exit;
}

// scandir($dir) retorna um array com todos os ficheiros e pastas da pasta
$files = scandir($dir);

// Percorrendo os arquivos
$id = 1;
foreach ($files as $file) {
    if ($file === '.' || $file === '..') continue;

    $name = pathinfo($file, PATHINFO_FILENAME); // nome sem extensão

    // Pegar apenas o nome entre '_' e '.'
    preg_match('/_(.*?)\./', $file, $matches);
    $name_select = $matches[1];

    $resultado[] = [
        'id' => $id,
        'template_doc_nome_arquivo' => $name,
        'template_doc_nome' => $name_select
    ];

    $id++;
}

echo json_encode($resultado, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

?>