import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, BadgeCheck, BookCheck } from "lucide-react";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const Alterar_Modelo_Capa : React.FC = () => {

    const navegate = useNavigate();

    /*========================================================
      Inicializando meu editor (Capa)
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
            content_style : `
            body::before {
                content: "CAPA DO DOCUMENTO";
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

        criarEditor("editor_capa",1128,804);

        return () => {
          tinymce.remove();
        };

    }, []); // Só executa uma vez


    /*========================================
      Iniciando Minhas Variáveis de Estado
    ==========================================*/
    const [modalSucces, setModalSucess] = useState(false);
    const [btnAcao, setBtnAcao] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const [modeloCapa, setModeloCapa] = useState([]);
    const [modeloCapaSelecionado, setModeloCapaSelecionado] = useState("");
    const [capaEditar, setCapaEditar] = useState("");
    const [nomeCapaEditar, setNomeCapaEditar] = useState("");


    /*===================================================================================================================
      Buscando os Modelos De Orçamentos e colocando na variável de estado "modelo" para depois percorrer com o .map()
    ====================================================================================================================*/
    useEffect(() => {

        fetch("http://localhost/marine-ops-BackEnd/orcamento/listar_modelos_capas.php")
        .then(response => response.json())
        .then(data => {
            setModeloCapa(data)
        })
        .catch((err) => console.error("Erro ao encontrar modelos " + err));

    }, []); // Só executa uma vez

    /*=============================================================================
     Preechendo os editores a medida que o usuário selecionar os modelos de capas
    ==============================================================================*/
    useEffect(() => {
        if (modeloCapaSelecionado && modeloCapaSelecionado !== "0") {
            
            // Pegando na base de dados o conteudo do modelo selecionado e jogando nos editores
            fetch(`http://localhost/marine-ops-BackEnd/orcamento/get_modelo_capa.php?codigo_capa=${modeloCapaSelecionado}`) 
            .then(res => res.json()) 
            .then(data => 
            {   
                setCapaEditar(data.capa || "");
                setNomeCapaEditar(data.nome || "");

                tinymce.get("editor_capa").setContent(data.capa || "");

            }) 
            .catch(err => 
            {
                console.error("Erro ao carregar modelo", err); 
            })


            // Ativando o botão para alteração
            setBtnAcao(true);

        } else {

            setCapaEditar("");
            setNomeCapaEditar("");

            tinymce.get("editor_capa").setContent("");

            setBtnAcao(false);

        }
    }, [modeloCapaSelecionado]); // Executa toda vez que modeloSelecionado mudar


    /*=======================================
        Clicou em Alterar Modelo
    =========================================*/
    function AlterarModelo(){

        // Setando o conteudo, codigo da capa, e nome da capa
        const capaAlterarEditar = tinymce.get("editor_capa").getContent();
        const codigoCapaEditar = modeloCapaSelecionado;
        const nomeCapaAlteradaEditar = nomeCapaEditar;

        // Fazer o fetch
        fetch("http://localhost/marine-ops-BackEnd/orcamento/alterar_modelo_capa.php", {
            method:"POST",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                capa_alterado_editar : capaAlterarEditar,
                codigo_capa_editar : codigoCapaEditar,
                nome_capa_editar : nomeCapaAlteradaEditar
            })
        })
        .then(res => res.json())
        .then(data => {

            // Se der tudo certo, abrir os modais
            if(data.status === "Certo"){
                setModalSucess(true);
                setOverlay(true);
            }else if(data.status === "Errado"){
                alert(data.erro);
            }

        })
        .catch((err) => console.error("Erro ao encontrar modelos " + err));
    }

    /*=========================================
        Usuário clicou em PDF
    ===========================================*/
    function gerarPdf() {

        const conteudoCapa = tinymce.get("editor_capa").getContent();

        fetch("http://localhost/marine-ops-BackEnd/orcamento/gerar_pdf.php?tipo=capa", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
            conteudo_capa : conteudoCapa,
        })
        })
        .then(response => response.blob())
        .then(blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        })

        
    };


    return(
        <div className="space-y-6 animate-fade-in">

            {/* ===========================================================================
               Cabeçalho principal -> breadcrumb (ou em português, “trilha de navegação”). 
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
                            Alterar Modelo De Capa
                        </BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>


            {/* ======================== 
              Corpo Principal Da Página
            ============================*/}
            <Card>
                {/* ======================== 
                    MODELOS DE CAPAS 
                ============================*/}
                <CardHeader>
                    <CardTitle className="flex gap-2">
                        <BookCheck className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 font-bold text-sm md:text-lg">Modelos De Capas Encontados</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-[#999999ff] mt-[-13px] mb-3">Foram Encontrado(s) {modeloCapa.length} Modelo(s)</p>
                
                <Select value={modeloCapaSelecionado} onValueChange={setModeloCapaSelecionado}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione O Modelo"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Selecione O Modelo</SelectItem>
                        {/*Percorrendo o Array "Modelo" e criando o option para cada modelo*/}
                        {modeloCapa.map((modelo) => (
                            <SelectItem key={modelo.codigo} value={modelo.codigo}>
                            {modelo.codigo} - {modelo.nome}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                
                </CardContent>
                

                {/* ======================== 
                        NOME MODELO
                ============================*/}
                <CardHeader className="mt-[-15px]">
                    <CardTitle className="flex gap-2">
                        <FileText className="w-6 h-6 text-blue-600 "/>
                        <p className="text-gray-700 font-bold text-sm md:text-lg">Nome Do Modelo De Capa</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input 
                        value={nomeCapaEditar} 
                        onChange={(e) => setNomeCapaEditar(e.target.value)} 
                        placeholder="Escolha o Modelo De Orçamento Que Deseja Alterar" 
                        className="focus:bg-white outline-none transition-all duration-200">
                    </Input>
                </CardContent>
            </Card>
            

            {/* ======================== 
                    EDITAR CAPA
            ============================*/}
            <Card>
                <CardContent>
                    <div className="flex items-center mb-4 mt-5">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                            <FileText className="w-7 h-7 text-[#fff]" strokeWidth={1.8} />
                        </div>
                        <p className="ml-2 font-bold">Capa Do Orçamento</p>
                    </div>
                    
                    <div className="flex items-center justify-center bg-[#eee] p-3 border border-[#ddd] shadow-sm">
                        <textarea id="editor_capa" value={capaEditar} onChange={(e) => setCapaEditar(e.target.value)}></textarea>
                    </div>
                </CardContent>
            </Card>
                

            
            {/*==================================================
                Botão para salvar novo modelo, ou então, gerar PDF
            =====================================================*/}
            <div className="flex gap-3 mt-7 items-center justify-center" style={{cursor : btnAcao ? "pointer" : "not-allowed"}}>

                <Button 
                    className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={() => AlterarModelo()} 
                    style={{opacity : btnAcao ? "1" : "0.6", pointerEvents: btnAcao ? "auto" : "none"}}
                    >Alterar Modelo
                </Button>

                <Button  
                    className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={() => gerarPdf()} 
                    style={{opacity : btnAcao ? "1" : "0.6", pointerEvents: btnAcao ? "auto" : "none"}}
                    >Gerar PDF
                </Button>

            </div>

            <AlertDialog open={modalSucces} onOpenChange={setModalSucess}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <BadgeCheck className="text-blue-500 w-14 h-14" />
                        <AlertDialogTitle>
                            Sucesso!
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            O Modelo De Capa Foi Criado Com Êxito!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {navegate("/configuracoes"); scrollTo({top : 0})}}>Voltar</AlertDialogCancel>
                        <Button  
                            className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            onClick={() => gerarPdf()} 
                            style={{opacity : btnAcao ? "1" : "0.6", pointerEvents: btnAcao ? "auto" : "none"}}
                            >Gerar PDF
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            
        </div>
    );

}

export default Alterar_Modelo_Capa;