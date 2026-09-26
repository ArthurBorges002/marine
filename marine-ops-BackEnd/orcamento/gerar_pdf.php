<?php
// Permitir requisições do React (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Importa as classes do Composer
require_once __DIR__ . '/../vendor/autoload.php';

use Mpdf\Mpdf;

// Cria o objeto mPDF
$mpdf = new Mpdf([
    'format' => 'A4',
    'margin_left' => 5,
    'margin_right' => 5
]);

// Lê o corpo da requisição enviado em formato JSON
$data = json_decode(file_get_contents("php://input"), true);

if(isset($_GET["tipo"]) && $_GET["tipo"] == "documento"){ // Tipo documento

    // Margins automáticas, para se ajustar automaticamente, cabeçalho, corpo e rodapé, e nada seobrepor nada.
    $mpdf->setAutoTopMargin = 'stretch';
    $mpdf->setAutoBottomMargin = 'stretch';
    
    // Separando as partes do meu PDF, cabeçalho, corpo e rodapé
    $capa = $data['capa'] ?? "";
    $cabecalho = $data['cabecalho'] ?? "";
    $corpo = $data['corpo'] ?? "";
    $rodape = $data['rodape'] ?? "";

    // ===================================
    // TEMPLATE E MARCA D´AGUA CAPA
    //====================================

    // Template CAPA (se houver)
    $template_capa = $data['template_capa_pdf'] ?? "";
    // Aplica o fundo do papel timbrado (se hoouver)
    if(!empty($template_capa)){
        $mpdf->SetDefaultBodyCSS('background', "url('http://localhost/marine-ops-backend/imagens_templates_pdf/templates_capas/$template_capa.png')");
        $mpdf->SetDefaultBodyCSS('background-image-resize', 6); // cover
    }

    // Marca d´agua CAPA (se houver)
    $marcaDagua_capa = $data['marca_d_agua_capa'] ?? "";

    if(!empty($marcaDagua_capa)){
        $mpdf->SetWatermarkText($marcaDagua_capa,0.1);
        $mpdf->showWatermarkText = true;
    }

    // Definindo CAPA (se houver)
    if(!empty($capa)){

        $mpdf->writeHTML($capa);
        $mpdf->SetHTMLHeader($cabecalho);
        $mpdf->AddPage();

        // Setando o rodape -> Aparecerá no fim de toda página
        $mpdf->SetHTMLFooter($rodape);


    }else{ // Se não houver capa

        // Setando o cabeçalho -> Apareçera no top de toda página
        $mpdf->SetHTMLHeader($cabecalho);

        // Setando o rodape -> Aparecerá no fim de toda página
        $mpdf->SetHTMLFooter($rodape);

    }

    // ===================================
    // TEMPLATE E MARCA D´AGUA DOCUMENTO
    //====================================

    // Template (se houver)
    $template_documento = $data['template_doc_pdf'] ?? "";
    // Aplica o fundo do papel timbrado (se hoouver)
    if(!empty($template_documento)){
        $mpdf->SetDefaultBodyCSS('background', "url('http://localhost/marine-ops-backend/imagens_templates_pdf/templates_docs/$template_documento.png')");
        $mpdf->SetDefaultBodyCSS('background-image-resize', 6); // cover
    }

    // Marca d´agua (se houver)
    $marcaDagua_documento = $data['marca_d_agua_documento'] ?? "";

    if(!empty($marcaDagua_documento)){
        $mpdf->SetWatermarkText($marcaDagua_documento,0.1);
        $mpdf->showWatermarkText = true;
    }


    // Setando o corpo do PDF -> Aparecerá no meio (entre cabeçalho e rodapé) de toda página.
    $mpdf->WriteHTML($corpo);


}else if(isset($_GET["tipo"]) && $_GET["tipo"] == "capa"){ // Tipo capa

    $capa = $data['capa'] ?? "";

    $mpdf->WriteHTML($capa);
    
}


// Defininado cabeçalhos HTTP
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="orcamento.pdf"');

// Gerando o PDF
$mpdf->Output();

?>
