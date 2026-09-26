
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Home, LayoutPanelTop, BadgeCheck, FileText } from "lucide-react";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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


const Novo_Modelo_Capa: React.FC = () => {

    const navegate = useNavigate();

    /*=====================================================
                Inicializando meu editor (Capa)
    =======================================================*/
    useEffect(() => {

        const criarEditor = (id: string, tamanhoAltura: number, tamanhoLargura: number ) => {

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
                content : "CAPA DO DOCUMENTO";
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

    }, []);


     /*=======================================
        Iniciando Minhas Variáveis de Estado
    =========================================*/
    const [nomeModeloCapa, setNomeModeloCapa] = useState('');
    const [alertar, setAlertar] = useState(false);
    const [modalSucces, setModalSucess] = useState(false);
    const [overlay, setOverlay] = useState(false);

    /*=========================================
        Usuário clicou em Criar Modelo 
    ===========================================*/

     // Caso o Campo de Nome de Modelo, não estiver Vazio, e não existir alertar (Borda vermelha no campo), o campo volta ao normal (setAlertar(false))
    useEffect(() => {
        if (nomeModeloCapa !== '' && alertar) {
            setAlertar(false);
        }
    }, [nomeModeloCapa, alertar]);


    function criarModelo(){

        // Primeiro verificando se está preechido o campo nome do modelo. Caso não esteja (setAlertar(true)), a borda fica vermelhinha e o scroll sobe ao topo
        if(nomeModeloCapa.trim() === ""){
            setAlertar(true);
            setTimeout(() => {
                scrollTo({ top: 0, behavior: 'smooth' });
              }, 50);
        }else{ // Nome do Modelo Preechido

            // Pegando as partes do documento, para salvar na base de dados
            const conteudoCapa = tinymce.get("editor_capa").getContent();

            // Fazendo a requisição ao servidor para salvar na base, e mandando, no corpo da requisição, nome, cabecalho, corpo e rodape.
            fetch("http://localhost/marine-ops-BackEnd/orcamento/salvar_novo_modelo_capa.php", {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                      conteudo_capa : conteudoCapa,
                      nome_modelo_capa: nomeModeloCapa
                  })
              })
              .then(res => res.json())
              .then(msg => {
                  if(msg.status === "Certo"){
                      {/*Deu tudo certo, mostra o modal de sucesso, e a tela borrada ao fundo*/}
                      setOverlay(true);
                      setModalSucess(true);
                  }else{
                      alert("Erro: " + msg.erro);
                  }
              });
            }
        }

        /*=========================================
            Usuário clicou em PDF
        ===========================================*/
        function gerarPdf() {

          const conteudoCapa = tinymce.get("editor_capa").getContent();;

          fetch("http://localhost/marine-ops-BackEnd/orcamento/gerar_pdf.php?criar_editar_orc&tipo=capa", {
            method: 'POST',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify ({
              capa : conteudoCapa,
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
                            Novo Modelo Capa
                        </BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>
                

            {/* ==================
              CONTEUDO DA PAGINA
            ======================*/}
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <p className="text-gray-700 font-bold text-sm md:text-lg">Escolha O Nome Da Sua Capa</p>
                    </CardTitle>
                </CardHeader>
                {/* =====================
                    NOME DO MODELO DA CAPA
                =========================*/}
                <CardContent>
                    <Input
                        value={nomeModeloCapa}  
                        onChange={(e) => setNomeModeloCapa(e.target.value)} 
                        className="focus:bg-white outline-none transition-all duration-200"
                        placeholder="Nome Do Modelo De Capa" 
                        style=
                        {{
                            borderColor: alertar ? "red" : "",
                            boxShadow : alertar ? "0 4px 15px rgba(255, 0, 0, 0.3)" : "",
                        }}
                    />
                </CardContent>
            </Card>

            {/* =========================
                CONTEUDO DO MODELO DA CAPA
            =============================*/}
            <Card className="mt-5">
                <CardContent>
                    <div className="flex items-center mb-4 mt-5">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-sm">
                            <LayoutPanelTop className="w-7 h-7 text-[#fff]"></LayoutPanelTop>
                        </div>
                        <p className="text-gray-700 ml-2 font-bold">Capa Do Orçamento</p>
                    </div>
                    <div className="flex items-center justify-center bg-[#eee] p-3 border border-[#ddd] shadow-sm">
                        <textarea id="editor_capa"></textarea>
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
                    onClick={() => criarModelo()}
                    >Criar Modelo De Capa
                </Button>

                <Button 
                    className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    type="button" 
                    onClick={() => gerarPdf()}
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
                            Modelo De Capa Foi Criado Com Êxito!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {navegate("/configuracoes"); scrollTo({top : 0})}}>Voltar</AlertDialogCancel>
                        <Button 
                            className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            type="button" 
                            onClick={() => gerarPdf()}
                            >Gerar PDF
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );

} 

export default Novo_Modelo_Capa;