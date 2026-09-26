import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Home, FileText, FileEdit, LayoutTemplate, LayoutPanelTop, Printer, BadgeCheck, Image, Info, Route, BookCheck, FileSearch, BookDashed} from "lucide-react";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import tinymce from "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";


const Novo_Orcamento: React.FC = () => {

    const navigate = useNavigate();

    /*==================================================================================================
    Veirificando se é criar orçamento, ou editar orçamento (Vai estar na url acao=editar ou acao=criar)
    ====================================================================================================*/
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
  
    const acao = queryParams.get("acao"); // "criar" ou "editar"
    const codigo_interno = queryParams.get("codigo_interno");
    const codigo = queryParams.get("codigo");


    /*=============================
       Variáveis de Estado 
    ===============================*/
    const [orcamentoNum, setOrcamentoNum] = useState([]);
    const [estado, setEstado] = useState([]);
    const [cidade, setCidade] = useState([]);
    const [estadoSelecionado, setEstadoSelecionado] = useState("");
    const [cidadeSelecionada, setCidadeSelecionada] = useState("");
    const [clienteSelecionado, setClienteSelecionado] = useState("");
    const [infoComplementar, setInfoComplementar] = useState("")
    const [valorTotal, setValorTotal] = useState("");
    const [modeloOrc, setModeloOrc] = useState([]);
    const [modeloOrcSelecionado, setModeloOrcSelecionado] = useState("");
    const [capaOrc, setCapaOrc] = useState([]);
    const [capaOrcSelecionada, setCapaOrcSelecionada] = useState("");
    /*=============================
       Variáveis de Estado Sucesso
    ===============================*/
    const [modalSucces, setModalSucces ] = useState(false);
    const [btnAcao, setBtnAcao] = useState(false);
    /*=========================================================================
       Variáveis de Estado Que controla, Capa, Documento, Template e Impressão
    ===========================================================================*/
    const [template, setTemplate] = useState(false);
    const [capa, setCapa] = useState(true);
    const [docs, setDocs] = useState(false);
    const [finalizaoImpresao, setFinalizaoImpressao] = useState(false);
    /*==================================================================================================================================
    Variaveis de estado para guardar as informações do orçamento, quando o usuario clicou em "editar", aparecer os campos já preechidos.
    =====================================================================================================================================*/
    const [nomeClienteEditar,setNomeClienteEditar] = useState('');
    const [infoComplementarEditar, setInfoComplementarEditar] = useState('');
    const [valorTotalEditar, setValorTotalEditar] = useState('');
    const [cabecalhoOrcamentoEditar, setCabecalhoOrcamentoEditar] = useState("");
    const [corpoOrcamentoEditar, setCorpoOrcamentoEditar] = useState("");
    const [rodapeOrcamentoEditar, setRodapeOrcamentoEditar] = useState("");
    const [estadoEditar, setEstadoEditar] = useState("");
    const [cidadeEditar, setCidadeEditar] = useState("");
    const [cidadeEditarLista, setCidadeEditarLista] = useState<any[]>([]);
    const [modeloEditar, setModeloEditar] = useState("");
    const [capaEditar, setCapaEditar] = useState("");
    const [codCapaEditar, setCodCapaEditar] = useState("");

    // COntrolando os valores que vão aparecer no select de "Escolha sua Capa" e "Escolha seu Modelo De Orçamento"
    const [alterouModelo, setAlterouModelo] = useState(false);
    const [alterouCapa, setAlterouCapa] = useState(false);

    /*====================
      TEMPLATE DOCUMENTO
    ======================*/
    const [templatesDocLista, setTemplatesDocLista] = useState([]);

    const [templateEscolhidoDocumento, setTemplateEscolhidoDocumento] = useState("");
    const [marcaDaguaDocumento, setMarcaDaguaDocumento] = useState("");
    const [templateEscolhidoDocumentoEditar, setTemplateEscolhidoDocumentoEditar] = useState("");
    const [marcaDaguaDocumentoEditar, setMarcaDaguaDocumentoEditar] = useState("");

    const [urlImageTemplateDoc, setUrlImageTemplateDoc] = useState("");
    const [urlImageTemplateDocEditar, setUrlImageTemplateDocEditar] = useState("");

    /*====================
       TEMPLATE CAPA
    ======================*/
    const [templatesCapaLista, setTemplatesCapaLista] = useState([]);

    const [templateEscolhidoCapa, setTemplateEscolhidoCapa] = useState("");
    const [marcaDaguaCapa, setMarcaDaguaCapa] = useState("");
    const [templateEscolhidoCapaEditar, setTemplateEscolhidoCapaEditar] = useState("");
    const [marcaDaguaCapaEditar, setMarcaDaguaCapaEditar] = useState("");


    const [templateCapaAcionado, setTemplateCapaAcionado] = useState(true);
    const [templateDocumentoAcionado, setTemplateDocumentoAcionado] = useState(false);

    const [urlImageTemplateCapa, setUrlImageTemplateCapa] = useState("");
    const [urlImageTemplateCapaEditar, setUrlImageTemplateCapaEditar] = useState("");

    /*==================================================================
    Criando os editores (Editor Cabeçalho, Editor Corpo, Editor Rodapé)
    ====================================================================*/
    useEffect(() => {

            const criarEditor = (id: string, content: string, tamanhoAltura: number, tamanhoLargura:number) => {

            tinymce.init({
                selector: `#${id}`,
                height: tamanhoAltura,
                width: tamanhoLargura,
                license_key: "gpl", // ESSENCIAL para não ficar desabilitado
                menubar: 'file edit view insert format tools table',
                plugins: [
                    'advlist','autolink','lists','link','image','charmap',
                    'preview','anchor','searchreplace','visualblocks','code','fullscreen',
                    'insertdatetime','media','table','help','wordcount'
                ],
                toolbar: [
                    'undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify',
                    '| bullist numlist outdent indent | link image media table | removeformat | code fullscreen preview'
                ].join(' '),
                toolbar_mode: 'sliding',
                contextmenu: 'link image table',
                branding: false,
                image_caption: true,
                image_advtab: true,
                image_uploadtab: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                content_style : `
                body::before {
                    content: "${content}";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 48px;
                    color: rgba(0, 0, 0, 0.1);
                    white-space: nowrap;
                    pointer-events: none;
                    user-select: none;
                    font-family: 'Poppins', sans-serif;
                }
                `
                });

            }

            criarEditor("editor_capa","Capa Do Documento",1128,804)
            criarEditor("editor_cabecalho","Configure Seu Cabeçalho",350,804);
            criarEditor("editor_corpo","Configure o Corpo Do Documento",600,804);
            criarEditor("editor_rodape","Configure Seu Rodapé",350,804);

            return () => {
            tinymce.remove();
            };

    }, [docs]);


    /*=================================================
    Função que irá retornar todos os estados do Brasil
    ===================================================*/
    useEffect(() => {

        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(res => res.json())
        .then(data => setEstado(data))
        .catch(err => console.error("Erro ao carregar estados:", err));

    }, [])
    

    /*=================================================================================================================
    Função que, a partir do momento que o usuário escolher o estado, irá retornar as cidades que pertecem a esse estado
    ===================================================================================================================*/
    useEffect(() => {

        if(acao === "criar") {
            if(!estadoSelecionado) return;
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
            .then(res => res.json())
            .then(data => setCidade(data))
            .catch(err => console.error("Erro ao carregar cidades:", err));

        }else if(acao === "editar"){
            if(!estadoEditar) return;
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoEditar}/municipios`)
            .then(res => res.json())
            .then(data => setCidadeEditarLista(data))
            .catch(err => console.error("Erro ao carregar cidades:", err));
        }
    }, [acao, estadoSelecionado, estadoEditar])


    /*========================================================================================================
     listar os modelos de orçamento - Colocar na variavel de estado "modelo", e depois percorrer com o .map()
    ==========================================================================================================*/
    useEffect(() => {
        fetch("http://localhost/marine-ops-BackEnd/orcamento/listar_modelos_orcamentos.php")
        .then(response => response.json())
        .then(data => {
            setModeloOrc(data)
        })
        .catch((err) => console.error("Erro ao encontrar modelos " + err));
    }, []);

    /*========================================================================================================
     listar as capas de orçamento - Colocar na variavel de estado "capa", e depois percorrer com o .map()
    ==========================================================================================================*/
    useEffect(() => {
        fetch("http://localhost/marine-ops-BackEnd/orcamento/listar_modelos_capas.php")
        .then(response => response.json())
        .then(data => {
            setCapaOrc(data)
        })
        .catch((err) => console.error("Erro ao encontrar modelos " + err));
    }, []);

    /*========================================================================================
     Listar modelos de Templates Para Capas, e depois percorrer com o .map()
    ===========================================================================================*/
    useEffect(() => {
        fetch("http://localhost/marine-ops-BackEnd/orcamento/listar_templates_capas.php")
        .then(res => res.json())
        .then(data => {
            setTemplatesCapaLista(data);
        })
    }, []);

    /*=======================================================================================
     Listar modelos de Templates Para Documentos, e depois percorrer com o .map()
    =========================================================================================*/
    useEffect(() => {
        fetch("http://localhost/marine-ops-BackEnd/orcamento/listar_templates_documentos.php")
        .then(res => res.json())
        .then(data => {
            setTemplatesDocLista(data);
        })
    },[]);
 
    /*=================================================================
    Preechendo os editores a medida que o usuário selecionar os modelos
    ===================================================================*/
    useEffect(() => {

        if (modeloOrcSelecionado && modeloOrcSelecionado !== "0") {

            setAlterouModelo(true);

            // Pegando na base de dados o conteudo do modelo selecionado
            fetch(`http://localhost/marine-ops-BackEnd/orcamento/get_modelo_orcamento.php?codigo_modelo=${modeloOrcSelecionado}`) 
            .then(res => res.json()) 
            .then(data => 
            { 
                tinymce.get("editor_cabecalho")?.setContent(data.cabecalho || "");
                tinymce.get("editor_corpo")?.setContent(data.corpo || "");
                tinymce.get("editor_rodape")?.setContent(data.rodape || "");
            }) 
            .catch(err => 
            {
                console.error("Erro ao carregar modelo", err); 
            })

            // Ativando o botão para alteração
            setBtnAcao(true);

        } else {

            tinymce.get("editor_cabecalho").setContent("");
            tinymce.get("editor_corpo").setContent("");
            tinymce.get("editor_rodape").setContent("");

            setBtnAcao(false);
        }
        

    }, [modeloOrcSelecionado]); // só roda quando modeloSelecionado mudar


    /*=================================================================
        Preechendo o editor a medida que o usuário selecionar a capa
    ===================================================================*/
     useEffect(() => {

        if (capaOrcSelecionada && capaOrcSelecionada !== "0") {

            setAlterouCapa(true);

            // Pegando na base de dados a capa selecionada selecionado
            fetch(`http://localhost/marine-ops-BackEnd/orcamento/get_modelo_capa.php?codigo_capa=${capaOrcSelecionada}`) 
            .then(res => res.json()) 
            .then(data => 
            { 
                tinymce.get("editor_capa")?.setContent(data.capa || "");

            }) 
            .catch(err => 
            {
                console.error("Erro ao carregar modelo", err); 
            })

        } else if (capaOrcSelecionada === "0") {

            tinymce.get("editor_capa").setContent("");

        }
        
    }, [capaOrcSelecionada]); // só roda quando Capa selecionada mudar


    /*TEMPLATE CAPA ESCOLHEU */
    useEffect(() => {

        if(templateEscolhidoCapa && templateEscolhidoCapa !== "0"){
            setTemplateEscolhidoCapa(templateEscolhidoCapa);
            setUrlImageTemplateCapa(`http://localhost/marine-ops-backend/imagens_templates_pdf/templates_capas/${templateEscolhidoCapa}.png`);
        }else{
            setTemplateEscolhidoCapa("");
            setUrlImageTemplateCapa("");
        }

    }, [templateEscolhidoCapa])

    /*TEMPLATE DOCUMENTO ESCOLHEU*/
    useEffect(() => {

        if(templateEscolhidoDocumento && templateEscolhidoDocumento !== "0"){
            setTemplateEscolhidoDocumento(templateEscolhidoDocumento);
            setUrlImageTemplateDoc(`http://localhost/marine-ops-backend/imagens_templates_pdf/templates_docs/${templateEscolhidoDocumento}.png`)
        }else{
            setTemplateEscolhidoDocumento("");
            setUrlImageTemplateDoc("");
        }
        
    }, [templateEscolhidoDocumento])

    /*TEMPLATE CAPA EDITOU*/
    useEffect(() => {

        if(templateEscolhidoCapaEditar && templateEscolhidoCapaEditar !== "0"){
            setTemplateEscolhidoCapaEditar(templateEscolhidoCapaEditar);
            setUrlImageTemplateCapaEditar(`http://localhost/marine-ops-backend/imagens_templates_pdf/templates_capas/${templateEscolhidoCapaEditar}.png`)
        }else{
            setTemplateEscolhidoCapaEditar("");
            setUrlImageTemplateCapaEditar("");
        }

    }, [templateEscolhidoCapaEditar])

    /*TEMPLATE DOCUMENTO EDITOU*/
    useEffect(() => {

        if(templateEscolhidoDocumentoEditar && templateEscolhidoDocumentoEditar !== "0"){

            setTemplateEscolhidoDocumentoEditar(templateEscolhidoDocumentoEditar);
            setUrlImageTemplateDocEditar(`http://localhost/marine-ops-backend/imagens_templates_pdf/templates_docs/${templateEscolhidoDocumentoEditar}.png`)

        }else {
            setTemplateEscolhidoDocumentoEditar("");
            setUrlImageTemplateDocEditar("");
        }

    }, [templateEscolhidoDocumentoEditar])


    /*=====================
     Edição de Orçamento
    ======================*/
    // Verificando se é edição ou criação de orçamento, se for edição, ele vai pegar as informações na base de dados, e atualizar a variavel de estado
     useEffect(() => {

            if(acao === "editar"){
                fetch(`http://localhost/marine-ops-BackEnd/orcamento/dados_editar_orcamento.php?codigo=${codigo}`)
                .then(res => res.json())
                .then(data => {
                    setNomeClienteEditar(data.nome_cliente);
                    setCidadeEditar(data.cidade);
                    setEstadoEditar(data.estado);
                    setInfoComplementarEditar(data.info_complementar);
                    setValorTotalEditar(data.valor_total);
                    setModeloEditar(data.codigo_modelo);
                    setCapaEditar(data.conteudo_capa || "");
                    setCodCapaEditar(data.codigo_capa);
                    setCabecalhoOrcamentoEditar(data.cabecalho || "");
                    setCorpoOrcamentoEditar(data.corpo || "");
                    setRodapeOrcamentoEditar(data.rodape || "");
                    setTemplateEscolhidoDocumentoEditar(data.template_selecionado_documento || "");
                    setMarcaDaguaDocumentoEditar(data.marca_d_agua_documento || "");
                    setTemplateEscolhidoCapaEditar(data.template_selecionado_capa || "");
                    setMarcaDaguaCapaEditar(data.marca_d_agua_capa || "");
                })
            }
        
    }, []);

    /*================================
     Número do Próximo Orçamento
    ==================================*/
    useEffect(() => {

            fetch("http://localhost/marine-ops-BackEnd/orcamento/listar_orcamentos.php")
            .then(res => res.json())
            .then(data => {
                setOrcamentoNum(data);
            })
    }, [])


    /*=======================================
     Usuário clicou em criar/editar Orçamento
    =========================================*/
    function criarOrcamento(){

        const codOrcamento = codigo;

        if(acao === "criar"){ // Se o usuário estiver criando o orçamento

            // Partes do Orçamento
            const capaOrcamento = tinymce.get("editor_capa").getContent();
            const cabecalhoOrcamento = tinymce.get("editor_cabecalho").getContent();
            const corpoOrcamento = tinymce.get("editor_corpo").getContent();
            const rodapeOrcamento = tinymce.get("editor_rodape").getContent();

            // Outras informações
            const codigoModelo = modeloOrcSelecionado;

            // Mudar o código do usuário
            const codigoUsuario = 1;
            const nomeCliente = clienteSelecionado;
            const estadoOrcamento = estadoSelecionado;
            const cidadeOrcamento = cidadeSelecionada;
            const info = infoComplementar;
            const valorTot = valorTotal;
            const codCapa = capaOrcSelecionada;
            const marcaDAguaDoc = marcaDaguaDocumento;
            const templateSelecionadoDoc = templateEscolhidoDocumento;
            const marcaDAguaCapa = marcaDaguaCapa;
            const templateSelecionadoCapa = templateEscolhidoCapa;
            
            fetch("http://localhost/marine-ops-BackEnd/orcamento/insert_orcamento.php", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify ({
                capa_conteudo : capaOrcamento,
                cabecalho: cabecalhoOrcamento,
                corpo: corpoOrcamento,
                rodape: rodapeOrcamento,
                codigo_modelo: codigoModelo,
                codigo_usuario : codigoUsuario,
                nome_cliente: nomeCliente,
                estado : estadoOrcamento,
                cidade : cidadeOrcamento,
                info_complementar : info,
                valor_total : valorTot,
                capa_orc : codCapa,
                marca_d_agua_documento : marcaDAguaDoc,
                template_selecionado_documento : templateSelecionadoDoc,
                marca_d_agua_capa : marcaDAguaCapa,
                template_selecionado_capa : templateSelecionadoCapa
                })
            })
            .then(res => res.json())
            .then(msg => {
                
                if(msg.status === "Certo"){
                    setModalSucces(true);
                }else{
                    alert("Erro: " + msg.erro);
                }
            })  
        
        }else{ // Se o usuário estiver editando o orçamento

            // Partes do Orçamento
            const capaOrcamento = tinymce.get("editor_capa").getContent();
            const cabecalhoOrcamento = tinymce.get("editor_cabecalho").getContent();
            const corpoOrcamento = tinymce.get("editor_corpo").getContent();
            const rodapeOrcamento = tinymce.get("editor_rodape").getContent();

            // Pegar o código Usuário certo (Usuário que Alterou).
            const codigoUsuario = 1;

            // Outras informações
            const codigoModeloOrc = alterouModelo ? modeloOrcSelecionado : modeloEditar;
            const codCapaEditarOrc = alterouCapa ? capaOrcSelecionada : codCapaEditar;
            const nomeClienteOrc = nomeClienteEditar;
            const estadoEditarOrc = estadoEditar;
            const cidadeEditarOrc = cidadeEditar;
            const infoEditarOrc = infoComplementarEditar;
            const valorTotEditarOrc = valorTotalEditar;
            const marcaDaguaEditarOrcDoc = marcaDaguaDocumentoEditar;
            const templateSelecionadoEditarOrcDoc = templateEscolhidoDocumentoEditar;
            const marcaDaguaEditarOrcCapa = marcaDaguaCapaEditar;
            const templateSelecionadoEditarOrcCapa = templateEscolhidoCapaEditar;

            fetch(`http://localhost/marine-ops-BackEnd/orcamento/update_orcamentos.php`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify ({
                capa_conteudo : capaOrcamento,
                cabecalho: cabecalhoOrcamento,
                corpo: corpoOrcamento,
                rodape: rodapeOrcamento,
                codigo_modelo: codigoModeloOrc,
                codigo_usuario : codigoUsuario,
                nome_cliente: nomeClienteOrc,
                estado : estadoEditarOrc,
                cidade : cidadeEditarOrc,
                info_complementar : infoEditarOrc,
                valor_total : valorTotEditarOrc,
                capa_orc : codCapaEditarOrc,
                marca_d_agua_documento : marcaDaguaEditarOrcDoc,
                template_selecionado_documento : templateSelecionadoEditarOrcDoc,
                marca_d_agua_capa : marcaDaguaEditarOrcCapa,
                template_selecionado_capa : templateSelecionadoEditarOrcCapa,
                codigo_orcamento : codOrcamento
                })
            })
            .then(res => res.json())
            .then(msg => {
                if(msg.status === "Certo"){
                    setModalSucces(true);
                }else{
                    alert("Erro: " + msg.erro);
                }
            })  

        }
    
    }


        /*=========================================
               Usuário clicou em PDF
        ===========================================*/
        function gerarPdf() {

        const capa = tinymce.get("editor_capa").getContent();
        const cabecalho = tinymce.get("editor_cabecalho").getContent();
        const corpo = tinymce.get("editor_corpo").getContent();
        const rodape = tinymce.get("editor_rodape").getContent();

        if(acao === "criar"){ // Quando está criando o orçamento
        
          // TEMPLATE --> DOCUMENTO
          const templatePDFDoc = templateEscolhidoDocumento;
          // MARCA D´AGUA -> DOCUMENTO
          const marcaDaguaPDFDoc = marcaDaguaDocumento;

          // TEMPLATE --> CAPA DOCUMENTO
          const templatePDFCapa = templateEscolhidoCapa;
          // MARCA D´AGUA -> CAPA DOCUMENTO
          const marcaDaguaPDFCapa = marcaDaguaCapa;

          fetch("http://localhost/marine-ops-BackEnd/orcamento/gerar_pdf.php?tipo=documento", {
            method: 'POST',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify ({
              capa : capa,
              cabecalho : cabecalho,
              corpo : corpo ,
              rodape : rodape,
              template_doc_pdf : templatePDFDoc,
              marca_d_agua_doc : marcaDaguaPDFDoc,
              template_capa_pdf : templatePDFCapa,
              marca_d_agua_capa : marcaDaguaPDFCapa
            })
          })
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            })

        }else if(acao === "editar"){ // Quando está editando o orçamento

          // TEMPLATE --> DOCUMENTO
          const templatePDFDoc = templateEscolhidoDocumentoEditar;
          // MARCA D´AGUA
          const marcaDaguaPDFDoc = marcaDaguaDocumentoEditar;

          // TEMPLATE -->CAPADOCUMENTO
          const templatePDFCapa = templateEscolhidoCapaEditar;
          // MARCA D´AGUA
          const marcaDaguaPDFCapa = marcaDaguaCapaEditar;

          fetch("http://localhost/marine-ops-BackEnd/orcamento/gerar_pdf.php?tipo=documento", {
            method: 'POST',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify ({
              capa : capa,
              cabecalho : cabecalho,
              corpo : corpo ,
              rodape : rodape,
              template_doc_pdf : templatePDFDoc,
              marca_d_agua_doc : marcaDaguaPDFDoc,
              template_capa_pdf : templatePDFCapa,
              marca_d_agua_capa : marcaDaguaPDFCapa
            })
          })
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            })

        }

    
    };


        
    return(
        <div className="space-y-6 animate-fade-in">
            
            {/*===========================================================================
               Cabeçalho principal -> breadcrumb (“trilha de navegação”).
            ==============================================================================*/}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Home className="w-4 h-4 text-blue-600" />
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate("/orcamentos")} className="hover:text-blue-600 cursor-pointer">
                    Orcamentos
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {acao === "criar" ? "Novo Orçamento" : "Editar Orçamento"}
                  </BreadcrumbPage>
                </BreadcrumbItem>

              </BreadcrumbList>
            </Breadcrumb>

            
            {/*=======================================
                     CONTEUDO DA PAGINA
            ==========================================*/}
            <div className="block">

                {/*============================================
                        Formulário Do Orçamento
                ===============================================*/}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <Info className="w-6 h-6 text-blue-600"/>
                                <p className="text-gray-700 font-bold text-sm md:text-lg">Informações do Orçamento</p>
                            </div>
                            <div className="rounded-[5px] bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 text-[#ffffff] font-bold">
                                {acao === "criar" && <p className="text-sm">Orçamento Nº {String(orcamentoNum).padStart(4,"0")}</p>}
                                {acao === "editar" && <p className="text-[14px] md:text-lg">{codigo_interno}</p>}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/*NOME CLIENTE*/}
                        <div className="w-full">
                            <div className="w-full">
                                {acao === "criar" && 
                                <Input 
                                    type="text" 
                                    value={clienteSelecionado} 
                                    placeholder="Nome Do Cliente Do Orçamento" 
                                    onChange={(e) => setClienteSelecionado(e.target.value)}
                                    className="focus:bg-white outline-none transition-all duration-200"
                                    />}
                                {acao === "editar" && 
                                <Input 
                                    type="text" 
                                    value={nomeClienteEditar}
                                    onChange={(e) => setNomeClienteEditar(e.target.value)}
                                    className="focus:bg-white outline-none transition-all duration-200"
                                    />}
                            </div>
                        </div>
                        
                        {/*ESTADO + CIDADE*/}
                        <div className="flex flex-wrap gap-4 w-full mt-5">

                            {/*ESTADO*/}
                            <div className="w-full md:w-[30%]">

                                {acao === "criar" && 
                                <Select value={estadoSelecionado} onValueChange={setEstadoSelecionado}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione Um Estado"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Selecine Um Estado</SelectItem>
                                        {estado.map((e) => (
                                            <SelectItem value={e.sigla} key={e.id}>{e.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>}

                                {acao === "editar" && 
                                <Select value={estadoEditar} onValueChange={setEstadoEditar}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione Um Estado"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Selecine Um Estado</SelectItem>
                                        {estado.map((e) => (
                                            <SelectItem value={e.sigla} key={e.id}>{e.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>}

                            </div>

                            {/*CIDADE*/}
                            <div className="w-full md:w-[30%]">

                                {acao === "criar" && 
                                <Select value={cidadeSelecionada} onValueChange={setCidadeSelecionada}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione Uma Cidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Selecine Uma cidade</SelectItem>
                                        {cidade.map((c) => (
                                            <SelectItem value={c.nome} key={c.id}>{c.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                
                                </Select>}

                                {acao === "editar" && 
                                <Select value={cidadeEditar} onValueChange={setCidadeEditar}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione Uma Cidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Selecine Uma cidade</SelectItem>
                                        {cidadeEditarLista.map((c) => (
                                            <SelectItem value={c.nome} key={c.id}>{c.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>}

                            </div>

                        </div>
                            
                        {/*Informação Complementar + Valor Total Do Orçamento*/}
                        <div className="w-full mt-5">
                            <div>
                                {acao === "criar" && 
                                <Textarea 
                                    value={infoComplementar} 
                                    placeholder="Informações Complementares" 
                                    onChange={(e) => setInfoComplementar(e.target.value)}
                                    className="focus:bg-white outline-none transition-all duration-200"
                                ></Textarea>}
                                {acao === "editar" && 
                                <Textarea 
                                    value={infoComplementarEditar}  
                                    onChange={(e) => setInfoComplementarEditar(e.target.value)}
                                    className="focus:bg-white outline-none transition-all duration-200"
                                ></Textarea>}
                            </div>
                        
                            <div className="mt-4">
                                {acao === "criar" && 
                                <Input 
                                    type="text" 
                                    value={valorTotal} 
                                    placeholder="Valor Total do Orçamento" 
                                    onChange={(e) => setValorTotal(e.target.value)}
                                    className="focus:bg-white outline-none transition-all duration-200"
                                />}
                                {acao === "editar" && 
                                <Input 
                                    type="text" 
                                    value={valorTotalEditar} 
                                    onChange={(e) => setValorTotalEditar(e.target.value)}
                                    className="focus:bg-white outline-none transition-all duration-200"
                                />}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            


                {/*==================================
                    Etapas de Criação do Orçamento
                =====================================*/}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <Route className="w-6 h-6 text-blue-600"/>
                            <p className="text-gray-700 font-bold text-sm md:text-lg">Etapas Da Criação do Orçamento</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-[#fafafa] flex items-center justify-start p-[10px] rounded-[15px] mb-[20px] border border-[#cdcdcd] overflow-x-auto scrollbar-thin"
                        style={{ gap: 24 }} 
                        >
                            {/* Grupo 1 -> CONFIGURAR CAPA*/}
                            <div className="flex flex-col items-center flex-shrink-0 min-w-[150px]">
                                <div className="rounded-[30%] h-[45px] w-[45px] bg-[#efefef] flex items-center justify-center border border-[#cdcdcd]">
                                    <FileText className="h-8 w-8 text-blue-500 cursor-pointer" 
                                    onClick={() => {
                                        setCapa(true); 
                                        setDocs(false); 
                                        setTemplate(false); 
                                        setFinalizaoImpressao(false)}
                                        } 
                                    />
                                </div>
                                <p className="mt-2 text-sm text-center" 
                                style={{
                                    color: capa ? "#007bff" : "#999999ff",
                                    fontWeight: capa ? "bold" : ""
                                }}>{acao === "criar" ? "Configurar Capa" : "Editar Capa"}</p>
                            </div>

                            {/* Linha */}
                            <div className="h-[3px] bg-[#d7d7d7] mx-4 flex-shrink-0" style={{ width: 130 }} ></div>

                            {/* Grupo 2 -> CRIAÇÃO DO ORÇAMENTO*/}
                            <div className="flex flex-col items-center flex-shrink-0 min-w-[160px]">
                                <div className=" rounded-[30%] h-[45px] w-[45px] bg-[#efefef] flex items-center justify-center border border-[#cdcdcd]">
                                    <FileEdit className="h-8 w-8 text-blue-500 cursor-pointer" 
                                    onClick={() => {
                                        setCapa(false); 
                                        setDocs(true); 
                                        setTemplate(false); 
                                        setFinalizaoImpressao(false)}
                                        }
                                    />
                                </div>
                                <p className="mt-2 text-sm text-center" style={{
                                    color: docs ? "#007bff" : "#999999ff",
                                    fontWeight: docs ? "bold" : ""
                                }}>{acao === "criar" ? "Criação do documento" : "Edição do Documento"}</p>
                            </div>

                            {/* Linha */}
                            <div className="h-[3px] bg-[#d7d7d7] mx-4 flex-shrink-0" style={{ width: 130 }} ></div>

                            {/* Grupo 3 -> TEMPLATE DA IMPRESSÃO*/}
                            <div className="flex flex-col items-center flex-shrink-0 min-w-[160px]">
                                <div className="rounded-[30%] h-[45px] w-[45px] bg-[#efefef] flex items-center justify-center border border-[#cdcdcd]">
                                    <LayoutTemplate className="h-8 w-8 text-blue-500 cursor-pointer" 
                                    onClick={() => {
                                        setCapa(false); 
                                        setDocs(false); 
                                        setTemplate(true); 
                                        setFinalizaoImpressao(false)}
                                        }
                                    />
                                </div>
                                <p className="mt-2 text-sm text-center" style={{
                                    color: template ? "#007bff" : "#999999ff",
                                    fontWeight : template ? "bold" : ""
                                }}>Template De Impressão</p>
                            </div>

                            {/* Linha */}
                            <div className="h-[3px] bg-[#d7d7d7] mx-4 flex-shrink-0" style={{ width: 130 }} ></div>

                            {/* Grupo 4 -> FINALIZAÇÃO*/}
                            <div className="flex flex-col items-center flex-shrink-0 min-w-[160px]">
                                <div className="rounded-[30%] h-[45px] w-[45px] bg-[#efefef] flex items-center justify-center border border-[#cdcdcd]">
                                <Printer className="h-8 w-8 text-blue-500 cursor-pointer" 
                                onClick={() => {
                                    setCapa(false); 
                                    setDocs(false); 
                                    setTemplate(false); 
                                    setFinalizaoImpressao(true)}}
                                />
                                </div>
                                <p className="mt-2 text-sm text-center" style={{
                                    color: finalizaoImpresao ? "#007bff" : "#999999ff",
                                    fontWeight : finalizaoImpresao ? "bold" : ""
                                }}>{acao === "criar" ? "Finalização/Impressão" : "Edição/Impressão"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                
                {/*QUANDO A ETAPA ---CAPA--- ESTÁ VERDADEIRO*/}
                {capa && 
                <Card className="mt-5 animate-slide-in">
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <BookCheck className="w-6 h-6 text-blue-600" />
                            <p className="text-gray-700 font-bold text-sm md:text-lg">Escolha A Capa Para Este Orçamento</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-sm text-[#999999ff] mt-[-8px]">{capaOrc.length} Capa(s) Encontrado(s)</p>
                    <div className="animate-slide-in mt-3">
                        {acao === "criar" && 
                        <Select value={capaOrcSelecionada} onValueChange={setCapaOrcSelecionada}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione A Capa Do Orçamento" ></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {capaOrc.map((modeloCapa) => (
                                    <SelectItem key={modeloCapa.codigo} value={modeloCapa.codigo}>
                                    {modeloCapa.codigo} - {modeloCapa.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>}

                        {acao === "editar" && 
                        <Select value={alterouCapa ? capaOrcSelecionada : codCapaEditar} onValueChange={setCapaOrcSelecionada}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione A Capa Do Orçamento" />
                            </SelectTrigger>
                            <SelectContent>
                                {capaOrc.map((modeloCapa) => (
                                    <SelectItem key={modeloCapa.codigo} value={modeloCapa.codigo}>
                                    {modeloCapa.codigo} - {modeloCapa.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>}

                    </div>
                    </CardContent>
                </Card>}
                    
                    
                    
                {/*QUANDO A ETAPA ---CRIAÇÃO DO DOCUMENTO--- ESTÁ VERDADEIRA*/}
                {docs && 
                <Card className="mt-5 animate-slide-in">
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <FileSearch className="w-6 h-6 text-blue-600"/>
                            <p className="text-gray-700 font-bold text-sm md:text-lg">Escolha O Modelo Do Orçamento</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-[#999999ff] mt-[-8px] mb-3">{modeloOrc.length} Modelo(s) Encontrado(s)</p>
                        <div className="animate-slide-in">
                            {acao === "criar" && 
                            <Select value={modeloOrcSelecionado} onValueChange={setModeloOrcSelecionado}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione O Modelo Do Orçamento"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {modeloOrc.map((modeloOrc) => (
                                        <SelectItem key={modeloOrc.codigo} value={modeloOrc.codigo}>
                                        {modeloOrc.codigo} - {modeloOrc.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>}

                            {acao === "editar" && 
                            <Select value={alterouModelo ? modeloOrcSelecionado : modeloEditar} onValueChange={setModeloOrcSelecionado}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione O Modelo Do Orçamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modeloOrc.map((modeloOrc) => (
                                        <SelectItem key={modeloOrc.codigo} value={modeloOrc.codigo}>
                                        {modeloOrc.codigo} - {modeloOrc.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>}
                        </div>
                    </CardContent>
                </Card>}

                    


                    {/*===========================================
                        CONTAINER EDIÇÃO E CRIAÇÃO DO ORÇAMENTO
                    =============================================*/}
                    <div className="mt-5">

                        {/*Se estiver na etapa 'Capa Do Documento'*/}
                        <Card className={capa ? "block animate-slide-in" : "hidden"}>
                            <CardContent className="mt-5">
                                <div className="flex items-center mb-4 ml-4 md:ml-0">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                                        <FileText className="w-7 h-7 text-[#fff]" strokeWidth={1.8} />
                                    </div>
                                    <p className="ml-2 font-bold">Capa do Documento</p>
                                </div>

                                <div className="flex items-center justify-center bg-[#eee] md:p-3 p-0 border border-[#ddd] shadow-sm">
                                    {acao === "criar" && <textarea id="editor_capa"></textarea>}
                                    {acao === "editar" && <textarea id="editor_capa" value={capaEditar} onChange={(e) => setCapaEditar(e.target.value)}></textarea>}
                                </div>
                            </CardContent>
                        </Card>

                        {/*Se estiver na etapa 'Criação do documento'*/}
                        <Card className={docs ? "block animate-slide-in" : "hidden"}>
                            <CardContent className="mt-5 ">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                                        <LayoutPanelTop className="w-7 h-7 text-[#fff]" strokeWidth={1.8} />
                                    </div>
                                    <p className="ml-2 text-gray-700 font-bold">Cabeçalho</p>
                                </div>

                                <div className="flex items-center justify-center bg-[#eee] md:p-3 p-0 border border-[#ddd] shadow-sm">
                                    {acao === "criar" && <textarea id="editor_cabecalho"></textarea>}
                                    {acao === "editar" && <textarea id="editor_cabecalho" value={cabecalhoOrcamentoEditar} onChange={(e) => setCabecalhoOrcamentoEditar(e.target.value)}></textarea>}
                                </div>
                            
                                <div className="flex items-center mb-4 mt-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                                        <FileText className="w-7 h-7 text-[#fff]" strokeWidth={1.8} />
                                    </div>
                                    <p className="ml-2 text-gray-700 font-bold">Corpo do Documento</p>
                                </div>

                                <div className="flex items-center justify-center bg-[#eee] md:p-3 p-0 border border-[#ddd] shadow-sm">
                                    {acao === "criar" && <textarea id="editor_corpo"></textarea>}
                                    {acao === "editar" && <textarea id="editor_corpo" value={corpoOrcamentoEditar} onChange={(e) => setCorpoOrcamentoEditar(e.target.value)}></textarea>}
                                </div>

                                <div className="flex items-center mb-4 mt-4" >
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                                        <LayoutPanelTop className="w-7 h-7 transform rotate-180 text-[#fff]" strokeWidth={1.8} />
                                    </div>
                                    <p className="ml-2 text-gray-700 font-bold">Rodapé</p>
                                </div>

                                <div className="flex items-center justify-center bg-[#eee] md:p-3 p-0 border border-[#ddd] shadow-sm">
                                    {acao === "criar" && <textarea id="editor_rodape"></textarea>}
                                    {acao === "editar" && <textarea id="editor_rodape" value={rodapeOrcamentoEditar} onChange={(e) => setRodapeOrcamentoEditar(e.target.value) }></textarea>}
                                </div>
                            </CardContent>
                        </Card>


                            {/*Se estiver na etapa 'Template'*/}
                        <Card className={template ? "block animate-slide-in" : "hidden"}>

                            {/*==================================================
                                SELECIONAR TEMPLATE CAPA OU TEMPLATE DOCUMENTO
                            =====================================================*/}
                            <CardHeader>
                                <CardTitle className="flex gap-2 mb-2">
                                    <BookDashed className="w-6 h-6 text-blue-600"/>
                                    <p className="text-gray-700 font-bold text-sm md:text-lg">Templates Do Orçamento</p>
                                </CardTitle>

                                <div className="grid grid-cols-2 gap-2 w-full mb-8">
                                    {/* Template da Capa */}
                                    <button
                                        className={`flex items-center justify-center gap-2 p-2 rounded-[7px] border transition-colors
                                        ${templateCapaAcionado ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-md" : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
                                        `}
                                        onClick={() => {
                                        setTemplateCapaAcionado(true);
                                        setTemplateDocumentoAcionado(false);
                                        }}
                                    >
                                        <FileText className="w-6 h-6" strokeWidth={1.8} />
                                        <span>Template da Capa</span>
                                    </button>
                    
                                    {/* Template do Documento */}
                                    <button
                                        className={`flex items-center justify-center gap-2 p-2 rounded-[7px] border transition-colors
                                        ${templateDocumentoAcionado ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-md" : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
                                        `}
                                        onClick={() => {
                                        setTemplateCapaAcionado(false);
                                        setTemplateDocumentoAcionado(true);
                                        }}
                                    >
                                        <FileEdit className="w-6 h-6" strokeWidth={1.8} />
                                        <span>Template do Documento</span>
                                    </button>
                                </div>
                            </CardHeader>

                            {/*TEMPLATE DA CAPA*/}
                            {templateCapaAcionado && 
                            <CardContent>
                                <div className="flex flex-wrap w-full justify-between animate-slide-in gap-5 mt-5">
                                    <div className="w-full md:w-[60%]">
                                        {/*Template CAPA*/}
                                        <p className="text-sm text-[#999999ff] mt-1 animate-slide-in mb-3">{templatesCapaLista.length} Templates De Capa Disponíveis Atualmente</p>
                                        {acao === "criar" && 
                                        <Select value={templateEscolhidoCapa} onValueChange={setTemplateEscolhidoCapa}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione O Template Da Capa" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {templatesCapaLista.map((templete_capa) => (
                                                    <SelectItem key={templete_capa.id} value={templete_capa.nome_template_capa_arquivo}>{templete_capa.nome_template_capa}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>}

                                        {acao === "editar" && 
                                        <Select value={templateEscolhidoCapaEditar} onValueChange={setTemplateEscolhidoCapaEditar}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione O Template Da Capa "/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {templatesCapaLista.map((template_capa) => (
                                                    <SelectItem key={template_capa.id} value={template_capa.nome_template_capa_arquivo}>{template_capa.nome_template_capa}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>}

                                        
                                        <p className="text-gray-800 pl-3 border-l-[5px] border-[#007bff] mt-5 mb-1">Definir Marca D´Agua</p>
                                        
                                        {/*TEXTO MARCA D´AGUA DOCUMENTO*/}
                                        {acao === "criar" && 
                                        <Input type="text" className="bg-[#fafafa] rounded-[5px] w-[100%] mt-2 p-2 border border-[#cdcdcd]" placeholder="Definir Texto" value={marcaDaguaCapa} onChange={(e) => setMarcaDaguaCapa(e.target.value)}/>}

                                        {acao === "editar" && 
                                        <Input type="text" className="bg-[#fafafa] rounded-[5px] w-[100%] mt-2 p-2 border border-[#cdcdcd]" placeholder="Definir Texto" value={marcaDaguaCapaEditar} onChange={(e) => setMarcaDaguaCapaEditar(e.target.value)}/>}

                                    </div>

                                    {/* Visualização Template capa (PREVIEW)*/}
                                    <div className="w-full md:w-[35%] h-[590px] border border-[#d1d5db] rounded-[5px] bg-white shadow-lg relative">
                                        
                                        {acao === "criar" && !templateEscolhidoCapa && !marcaDaguaCapa &&
                                        <div className="absolute flex flex-col justify-center items-center w-full h-full">
                                            <Image className="w-[100px] h-[100px] text-gray-300" />
                                            <p className="mt-1 text-[#9ca3af] text-4xl font-medium">Preview</p>
                                            <p className="text-[#9ca3af] text font-medium mt-1">Escolha o Modelo para visualizar o preview.</p>
                                        </div>}


                                        {acao === "editar" && !templateEscolhidoCapaEditar && !marcaDaguaCapaEditar &&
                                        <div className="absolute flex flex-col justify-center items-center w-full h-full">
                                            <Image className="w-[100px] h-[100px] text-gray-300" />
                                            <p className="mt-1 text-[#9ca3af] text-4xl font-medium">Preview</p>
                                            <p className="text-[#9ca3af] text font-medium mt-1">Escolha o Modelo para visualizar o preview.</p>
                                        </div>}

                                        {acao === "criar" && <div className={`bg-no-repeat bg-top bg-[length:100%_100%] relative w-full h-full`} style={{
                                            backgroundImage : `url(${urlImageTemplateCapa})`
                                        }}>
                                        <p
                                            className={`
                                            absolute
                                            top-1/2 left-1/2
                                            -translate-x-1/2 -translate-y-1/2
                                            rotate-[-45deg]
                                            text-7xl md:text-9xl
                                            text-gray-400  font-bold
                                            opacity-45
                                            whitespace-nowrap
                                            pointer-events-none
                                            select-none
                                            `}
                                        >
                                            {marcaDaguaCapa}
                                        </p>
                                        </div>}

                                        {acao === "editar" && <div className={`bg-no-repeat bg-top bg-[length:100%_100%] relative w-full h-full`} style={{
                                            backgroundImage : `url(${urlImageTemplateCapaEditar})`
                                        }}>
                                        <p
                                            className={`
                                            absolute
                                            top-1/2 left-1/2
                                            -translate-x-1/2 -translate-y-1/2
                                            rotate-[-45deg]
                                            text-7xl md:text-9xl
                                            text-gray-400  font-bold
                                            opacity-45
                                            whitespace-nowrap
                                            pointer-events-none
                                            select-none
                                            `}
                                        >
                                            {marcaDaguaCapaEditar}
                                        </p>
                                        </div>}
                                    </div>

                                </div>
                            </CardContent>}

                                    
                            {/*TEMPLATE DO DOCUMENTO*/}
                            {templateDocumentoAcionado && 
                            <CardContent>
                            <div className="flex flex-wrap w-full justify-between animate-slide-in gap-5 mt-5">
                                <div className="w-full md:w-[60%]">
                                    {/*Template Documento*/}
                                    <p className="text-sm text-[#999999ff] mt-1 animate-slide-in mb-3">{templatesDocLista.length} Templates De Documento Disponíveis Atualmente</p>

                                    {acao === "criar" && 
                                    <Select value={templateEscolhidoDocumento} onValueChange={setTemplateEscolhidoDocumento}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione O Template Do Documento "/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templatesDocLista.map((template_doc) => (
                                                <SelectItem key={template_doc.id} value={template_doc.template_doc_nome_arquivo}>{template_doc.template_doc_nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>}

                                    {acao === "editar" && 
                                    <Select value={templateEscolhidoDocumentoEditar} onValueChange={setTemplateEscolhidoDocumentoEditar} >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione O Template Do Documento"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templatesDocLista.map((template_doc) => (
                                                <SelectItem key={template_doc.id} value={template_doc.template_doc_nome_arquivo}>{template_doc.template_doc_nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>}

                                    
                                    <p className="text-gray-800 pl-3 border-l-[5px] border-[#007bff] mt-5 mb-1">Definir Marca D´Agua</p>
                                    
                                    {/*TEXTO MARCA D´AGUA DOCUMENTO*/}
                                    {acao === "criar" && 
                                    <Input type="text" className="bg-[#fafafa] rounded-[5px] w-full mt-2 p-2 border border-[#cdcdcd]" placeholder="Definir Texto" value={marcaDaguaDocumento} onChange={(e) => setMarcaDaguaDocumento(e.target.value)}/>}

                                    {acao === "editar" && 
                                    <Input type="text" className="bg-[#fafafa] rounded-[5px] w-full mt-2 p-2 border border-[#cdcdcd]" placeholder="Definir Texto" value={marcaDaguaDocumentoEditar} onChange={(e) => setMarcaDaguaDocumentoEditar(e.target.value)}/>}

                                </div>

                                {/* Visualização Template Do documento (PREVIEW)*/}
                                <div className="w-full md:w-[35%] h-[590px] border border-[#d1d5db] rounded-[5px] bg-white shadow-lg relative">

                                    {acao === "criar" && !templateEscolhidoDocumento && !marcaDaguaDocumento && 
                                    <div className="absolute flex flex-col justify-center items-center w-full h-full">
                                        <Image className="w-[100px] h-[100px] text-gray-300" />
                                        <p className="mt-1 text-[#9ca3af] text-4xl font-medium">Preview</p>
                                        <p className="text-[#9ca3af] text font-medium mt-1">Escolha o Modelo para visualizar o preview.</p>
                                    </div>}

                                    {acao === "editar" && !templateEscolhidoDocumentoEditar && !marcaDaguaDocumentoEditar && 
                                    <div className="absolute flex flex-col justify-center items-center w-full h-full">
                                        <Image className="w-[100px] h-[100px] text-gray-300" />
                                        <p className="mt-1 text-[#9ca3af] text-4xl font-medium">Preview</p>
                                        <p className="text-[#9ca3af] text font-medium mt-1">Escolha o Modelo para visualizar o preview.</p>
                                    </div>}

                                    {acao === "criar" && <div className={`bg-no-repeat bg-top bg-[length:100%_100%] relative w-full h-full`} style={{
                                        backgroundImage : `url(${urlImageTemplateDoc})`
                                    }}>
                                    <p
                                        className={`
                                        absolute
                                        top-1/2 left-1/2
                                        -translate-x-1/2 -translate-y-1/2
                                        rotate-[-45deg]
                                        text-7xl md:text-9xl
                                        text-gray-400  font-bold
                                        opacity-45
                                        whitespace-nowrap
                                        pointer-events-none
                                        select-none
                                        `}
                                    >
                                        {marcaDaguaDocumento}
                                    </p>
                                    </div>}

                                    {acao === "editar" && <div className={`bg-no-repeat bg-top bg-[length:100%_100%] relative w-full h-full`} style={{
                                        backgroundImage : `url(${urlImageTemplateDocEditar})`
                                    }}>
                                    <p
                                        className={`
                                        absolute
                                        top-1/2 left-1/2
                                        -translate-x-1/2 -translate-y-1/2
                                        rotate-[-45deg]
                                        text-7xl md:text-9xl
                                        text-gray-400  font-bold
                                        opacity-45
                                        whitespace-nowrap
                                        pointer-events-none
                                        select-none
                                        `}
                                    >
                                        {marcaDaguaDocumentoEditar}
                                    </p>
                                    </div>}

                                </div>
                            </div>
                        </CardContent>}
                    </Card>

                    {/*Se estiver na etapa 'Finalização/Impressão'*/}
                    <div className={finalizaoImpresao ? "flex gap-5 animate-slide-in" : "hidden"} style={{
                        cursor: acao === "criar" ? (btnAcao ? "pointer" : "not-allowed") : "pointer",
                    }}>
                        <Button 
                        style={{ opacity: acao === "criar" ? (btnAcao ? "1" : "0.6") : "1", pointerEvents: acao === "criar" ? (btnAcao ? "auto" : "none") : "auto", }}
                        onClick={() => criarOrcamento()}>{acao === "criar" ? "Criar Orçamento" : "Editar Orçamento"}
                        </Button>

                        <Button 
                        style={{
                            opacity: acao === "criar" ? (btnAcao ? "1" : "0.6") : "1",
                            pointerEvents: acao === "criar" ? (btnAcao ? "auto" : "none") : "auto",
                        }}
                        onClick={() => gerarPdf()}>Visualizar em PDF
                        </Button>
                    </div>

                    <AlertDialog open={modalSucces} onOpenChange={setModalSucces}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <BadgeCheck className="text-blue-500 w-14 h-14" />
                                <AlertDialogTitle>
                                    Sucesso!
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {acao == "criar" ? 'Orçamento Foi Criado Com Êxito' : 'Orçamento Foi Editado Com Êxito'}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => {navigate("/orcamentos"); scrollTo({top: 0})}}>Voltar</AlertDialogCancel>
                                <Button className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300" type="button" onClick={() => gerarPdf()}>
                                    Gerar PDF
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    )

};

export default Novo_Orcamento;