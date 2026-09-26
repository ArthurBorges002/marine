import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, LayoutPanelTop, BadgeCheck, FileSearch, FilePlus } from "lucide-react";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/*======================================
Importando o TINYMCE -> Editores
========================================*/
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
import { api, abrirPdf, mensagemErro } from "@/lib/api";

const Alterar_Modelo_Orcamento : React.FC = () => {

    const navegate = useNavigate();

    /*========================================================
      Inicializando meus editores (Cabeçaalho, Corpo e Rodapé)
    ==========================================================*/
    useEffect(() => {

        const criarEditor = (id: string, tamanhoAltura: number, tamanhoLargura:number) => {

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
            content_style: `
                body::before {
                content: 'MODELO ORÇAMENTO';
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

        criarEditor("editor_cabecalho",350,804);
        criarEditor("editor_corpo",600,804);
        criarEditor("editor_rodape",350,804);

        return () => {
          tinymce.remove();
        };

    }, []); // Só executa uma vez


    /*========================================
      Iniciando Minhas Variáveis de Estado
    ==========================================*/
    const [modalSucces, setModalSucess] = useState(false);
    const [btnAcao, setBtnAcao] = useState(false);
    const [modelo, setModelo] = useState([]);

    const [modeloSelecionado, setModeloSelecionado] = useState("");
    const [cabecalhoEditar, setCabecalhoEditar] = useState("");
    const [corpoEditar, setCorpoEditar] = useState("");
    const [rodapeEditar, setRodapeEditar] = useState("");
    const [nomeEditar, setNomeEditar] = useState("");


    /*=============================================================================
      Buscando os Modelos De Orçaamentos e colocando na variável de estado "modelo"
    ===============================================================================*/
    useEffect(() => {

        api.get("/modelos-orcamento")
        .then(data => {
            setModelo(data)
        })
        .catch((err) => console.error("Erro ao encontrar modelos " + err));

    }, []); // Só executa uma vez

    /*===================================================================
     Preechendo os editores a medida que o usuário selecionar os modelos
    =====================================================================*/
    useEffect(() => {
        if (modeloSelecionado && modeloSelecionado !== "0") {
            
            // Pegando na base de dados o conteudo do modelo selecionado e jogando nos editores
            api.get(`/modelos-orcamento/${modeloSelecionado}`)
            .then(data =>
            {   
                setCabecalhoEditar(data.cabecalho || "");
                setCorpoEditar(data.corpo || "");
                setRodapeEditar(data.rodape || "");
                setNomeEditar(data.nome || "");

                tinymce.get("editor_cabecalho").setContent(data.cabecalho || "");
                tinymce.get("editor_corpo").setContent(data.corpo || "");
                tinymce.get("editor_rodape").setContent(data.rodape || "");
            }) 
            .catch(err => 
            {
                console.error("Erro ao carregar modelo", err); 
            })


            // Ativando o botão para alteração
            setBtnAcao(true);

        } else {

            setCabecalhoEditar("");
            setCorpoEditar("");
            setRodapeEditar("");
            setNomeEditar("");

            tinymce.get("editor_cabecalho").setContent("");
            tinymce.get("editor_corpo").setContent("");
            tinymce.get("editor_rodape").setContent("");

            setBtnAcao(false);

        }
    }, [modeloSelecionado]); // Executa toda vez que modeloSelecionado mudar


    /*=======================================
        Clicou em Alterar Modelo
    =========================================*/
    function AlterarModelo(){

        const cabecalhoAlteradoEditor = tinymce.get("editor_cabecalho").getContent();
        const corpoAlteradoEditor = tinymce.get("editor_corpo").getContent();
        const rodapeAlteradoEditor = tinymce.get("editor_rodape").getContent();
        const nomeModeloEditar = nomeEditar;
        const codigoModeloEditar = modeloSelecionado;

        // Fazer o fetch
        api.put(`/modelos-orcamento/${codigoModeloEditar}`, {
            nome : nomeModeloEditar,
            cabecalho : cabecalhoAlteradoEditor,
            corpo : corpoAlteradoEditor,
            rodape : rodapeAlteradoEditor
        })
        .then(() => {
            // Se der tudo certo, abrir os modais
            setModalSucess(true);
        })
        .catch((err) => alert("Erro: " + mensagemErro(err)));
    }

    /*=========================================
        Usuário clicou em PDF
    ===========================================*/
    function gerarPdf() {

        const cabecalho = tinymce.get("editor_cabecalho").getContent();
        const corpo = tinymce.get("editor_corpo").getContent();
        const rodape = tinymce.get("editor_rodape").getContent();

        api.blob("/pdf/documento", {
            cabecalho : cabecalho,
            corpo : corpo ,
            rodape : rodape
        })
        .then(abrirPdf)
        .catch(err => alert("Erro ao gerar PDF: " + mensagemErro(err)));

        
    };


    return(
        <div className="space-y-6 animate-fade-in">

            {/* ===========================================================================
               Cabeçalho principal -> breadcrumb (ou em português, trilha de navegação).
            ===============================================================================*/}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">
                            <Home className="w-4 h-4 text-blue-600" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
            
                <BreadcrumbSeparator />
            
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => navegate("/configuracoes")} className="hover:text-blue-600 cursor-pointer">
                            Configurações
                        </BreadcrumbLink>
                    </BreadcrumbItem>
            
                <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbPage>
                        Alterar Modelo De Orçamento
                        </BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>



            {/* ==========================
               CORPO PRINCIPAL DA PAGINA
            ==============================*/}
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2">
                        <FileSearch className="w-6 h-6 text-blue-600"/>
                        <p className="text-gray-700 font-bold text-sm md:text-lg">Modelos De Orçamentos Encontados</p>
                    </CardTitle>
                </CardHeader>
                    <CardContent>
                    <p className="text-sm text-[#999999ff] mt-[-10px] mb-3">Foram Encontrado(s) {modelo.length} Modelo(s)</p>
                    <Select value={modeloSelecionado} onValueChange={setModeloSelecionado}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione O Modelo"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Selecione O Modelo</SelectItem>
                            {/*Percorrendo o Array "Modelo" e criando o option para cada modelo*/}
                            {modelo.map((modelo) => (
                                <SelectItem key={modelo.codigo} value={modelo.codigo}>
                                {modelo.codigo} - {modelo.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    
                </CardContent>

                <CardHeader className="mt-[-15px]">
                    <CardTitle className="flex gap-2">
                        <FilePlus className="w-6 h-6 text-blue-600"/>
                        <p className="text-gray-700 font-bold text-sm md:text-lg">Nome Do Modelo De Orçamento</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                        <Input 
                        value={nomeEditar}
                        onChange={(e) => setNomeEditar(e.target.value)}  
                        placeholder="Escolha o Modelo De Orçamento Que Deseja Alterar" 
                        className="focus:bg-white outline-none transition-all duration-200" 
                    >
                    </Input>
                </CardContent>
            </Card>

            {/* ============================
                CABEÇALHO, CORPO E RODAPE
            ================================*/}
            <Card className="mt-5">
                <CardContent>
                    <div className="flex items-center mb-4 mt-5">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                            <LayoutPanelTop className="w-7 h-7 text-[#fff]" strokeWidth={1.8} />
                        </div>
                        <p className="ml-2 font-bold">Cabeçalho</p>
                    </div>

                    <div className="flex items-center justify-center bg-[#eee] p-3 border border-[#ddd] shadow-sm">
                        <textarea id="editor_cabecalho" value={cabecalhoEditar} onChange={(e) => setCabecalhoEditar(e.target.value)}></textarea>
                    </div>
                
                
                
                    <div className="flex items-center mb-4 mt-5">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                            <FileText className="w-7 h-7 text-[#fff]" strokeWidth={1.8} />
                        </div>
                        <p className="ml-2 font-bold">Corpo do Documento</p>
                    </div>
                
                    <div className="flex items-center justify-center bg-[#eee] p-3 border border-[#ddd] shadow-sm">
                        <textarea id="editor_corpo" value={corpoEditar} onChange={(e) => setCorpoEditar(e.target.value)}></textarea>
                    </div>
                

                
                    <div className="flex items-center mb-4 mt-5">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                            <LayoutPanelTop className="w-7 h-7 text-[#fff] rotate-180" strokeWidth={1.8} />
                        </div>
                        <p className="ml-2 font-bold">Rodapé</p>
                    </div>
                    <div className="flex items-center justify-center bg-[#eee] p-3 border border-[#ddd] shadow-sm">
                        <textarea id="editor_rodape" value={rodapeEditar} onChange={(e) => setRodapeEditar(e.target.value)}></textarea>
                    </div>
                </CardContent>
            </Card>

            {/*==================================================
                Botão para alterar modelo, ou então, gerar PDF
            =====================================================*/}
            <div className="flex gap-3 mt-6 justify-center" style={{cursor : btnAcao ? "pointer" : "not-allowed"}}>

                <Button 
                    className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    type="button"
                    onClick={() => AlterarModelo()} 
                    style={{opacity : btnAcao ? "1" : "0.6", pointerEvents: btnAcao ? "auto" : "none"}}
                    >Alterar Modelo
                </Button>

                <Button 
                    className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    type="button"
                    onClick={() => gerarPdf()} 
                    style={{opacity : btnAcao ? "1" : "0.6", pointerEvents: btnAcao ? "auto" : "none"}}
                    >Pré-visualizar em PDF
                </Button>

                <AlertDialog open={modalSucces} onOpenChange={setModalSucess}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <BadgeCheck className="text-blue-500 w-14 h-14" />
                            <AlertDialogTitle>
                                Sucesso!
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Modelo De Orçamento Foi Alterado Com Êxito!
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { navegate("/configuracoes"); scrollTo({ top: 0 })}}>Voltar</AlertDialogCancel>
                            <Button className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300" type="button" onClick={() => gerarPdf()}>
                                Gerar PDF
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );

}

export default Alterar_Modelo_Orcamento;