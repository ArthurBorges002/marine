
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Home, FileText, LayoutPanelTop, BadgeCheck, FilePlus } from "lucide-react";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const Novo_Modelo_Orcamento: React.FC = () => {

    const navegate = useNavigate();

    /*========================================================
      Inicializando meus editores (Cabeçalho, Corpo e Rodapé)
    ==========================================================*/
    useEffect(() => {

        const criarEditor = (id: string, tamanhoAltura: number, tamanhoLargura: number) => {

            tinymce.init({
            selector: `#${id}`,
            height: tamanhoAltura,
            width:tamanhoLargura,
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
                content: "MODELO ORÇAMENTO";
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

    }, []);


    /*=====================================
      Iniciando Minhas Variáveis de Estado
    ========================================*/
    const [nomeModelo, setNomeModelo] = useState("");
    const [alertar, setAlertar] = useState(false);
    const [modalSucces, setModalSucess] = useState(false);


    /*=========================================
        Usuário clicou em Criar Modelo 
    ===========================================*/

     // Caso o Campo de Nome de Modelo, não estiver Vazio, e não existir alertar (Borda vermelha no campo), o campo volta ao normal (setAlertar(false))
    useEffect(() => {
        if (nomeModelo !== '' && alertar) {
            setAlertar(false);
        }
    }, [nomeModelo, alertar]);


    function criarModelo(){

        // Primeiro verificando se está preechido o campo nome do modelo. Caso não esteja (setAlertar(true)), a borda fica vermelhinha e o scroll sobe ao topo
        if(nomeModelo.trim() === ""){
            setAlertar(true);
            setTimeout(() => {
                scrollTo({ top: 0, behavior: 'smooth' });
              }, 50);
        }else{ // Nome do Modelo Preechido

            // Pegando as partes do documento, para salvar na base de dados
            const cabecalho = tinymce.get("editor_cabecalho").getContent();
            const corpo = tinymce.get("editor_corpo").getContent();
            const rodape = tinymce.get("editor_rodape").getContent();

            // Fazendo a requisição ao servidor para salvar na base, e mandando, no corpo da requisição, nome, cabecalho, corpo e rodape.
            api.post("/modelos-orcamento", {
                  nome: nomeModelo,
                  cabecalho: cabecalho,
                  corpo: corpo,
                  rodape: rodape
              })
              .then(() => {
                  {/*Deu tudo certo, abre a mensagem de suceso*/}
                  setModalSucess(true);
              })
              .catch(err => alert("Erro: " + mensagemErro(err)));

            }
        }

        /*================================
            Usuário clicou em PDF
        ==================================*/
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
                        <BreadcrumbLink onClick={() => navegate("/configuracoes")} className="hover:text-blue-600 cursor-pointer">
                            Configurações
                        </BreadcrumbLink>
                    </BreadcrumbItem>
            
                <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Novo Modelo De Orçamento
                        </BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>
                

            {/*=======================================
                     CONTEUDO DA PAGINA
            ==========================================*/}
            <div className="block">

                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <FilePlus className="w-6 h-6 text-blue-600" />
                            <p className="text-gray-700 font-bold text-sm md:text-lg">Escolha o Nome Do Seu Modelo</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input 
                        value={nomeModelo} 
                        onChange={(e) => setNomeModelo(e.target.value)} 
                        placeholder="Nome do modelo" 
                        className="focus:bg-white outline-none transition-all duration-200"
                        style=
                            {{
                                borderColor: alertar ? "red" : "",
                                boxShadow : alertar ? "0 4px 15px rgba(255, 0, 0, 0.3)" : "",
                            }}
                        />
                    </CardContent>
                </Card>
                
                

                {/*===========================
                   Cabeçalho, Corpo E Rodapé.
                ==============================*/}
                <Card className="mt-5">
                    <CardContent>
                        <div className="flex items-center mb-4 mt-5">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                                <LayoutPanelTop className="w-7 h-7 text-[#fff]"></LayoutPanelTop>
                            </div>
                            <p className="text-gray-700 ml-2 font-bold">Cabeçalho</p>
                        </div>
                        <div className="flex items-center justify-center bg-[#eee] p-3 border border-[#ddd] shadow-sm">
                            <textarea id="editor_cabecalho"></textarea>
                        </div>
                   
                        <div className="flex items-center mb-4 mt-5">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                                <FileText className="w-7 h-7 text-[#fff]"></FileText>
                            </div>
                            <p className="text-gray-700 ml-2 font-bold">Corpo do Documento</p>
                        </div>
                        <div className="flex items-center justify-center bg-[#eee] p-3 border border-[#ddd] shadow-sm">
                            <textarea id="editor_corpo"></textarea>
                        </div>
                    
                        <div className="flex items-center mb-4 mt-5">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                                <LayoutPanelTop className="w-7 h-7 text-[#fff] rotate-180"></LayoutPanelTop>
                            </div>
                            <p className="text-gray-700 ml-2 font-bold">Rodapé</p>
                        </div>
                        <div className="flex items-center justify-center bg-[#eee] p-3 border border-[#ddd] shadow-sm">
                            <textarea id="editor_rodape"></textarea>
                        </div>
                    </CardContent>
                </Card>
                
                {/*==================================================
                  Botão para salvar novo modelo, ou então, gerar PDF
                =====================================================*/}
                <div className="flex gap-5 mt-6 justify-center items-center">
                    <Button
                        className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        type="button" 
                        onClick={() => criarModelo()}>
                            Criar Modelo
                    </Button>

                    <Button 
                        className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        type="button" 
                        onClick={() => gerarPdf()}>
                            Gerar PDF
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
                                Modelo De Orçamento Criado Com Êxito!
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {navegate("/configuracoes"); scrollTo({ top: 0}) }}>Voltar</AlertDialogCancel>
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

export default Novo_Modelo_Orcamento;