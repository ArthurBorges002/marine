
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, BadgeCheck, FileText, FileEdit , Image, Blocks, BookDashed} from "lucide-react";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, mensagemErro } from "@/lib/api";

const Novo_Template_Orcamento: React.FC = () => {

    const navegate = useNavigate();

     /*===================================
    Iniciando Minhas Variáveis de Estado
    =====================================*/
    const [nomeModeloTemplateCapa, setNomeModeloTemplateCapa] = useState('');
    const [nomeModeloTemplateDoc, setNomeModeloTemplateDoc] = useState('');
    const [alertarNomeTemplateCapa, setAlertarNomeTemplateCapa] = useState(false);
    const [alertarNomeTemplateDoc, setAlertarNomeTemplateDoc] = useState(false);
    const [alertarArquivoTemplateCapa, setAlertarArquivoTemplateCapa] = useState(false);
    const [alertarArquivoTemplateDoc, setAlertarArquivoTemplateDoc] = useState(false);
    const [modalSucces, setModalSucess] = useState(false);
    const [overlay, setOverlay] = useState(false);

    const [templateCapaAcionado, setTemplateCapaAcionado] = useState(true);
    const [templateDocumentoAcionado, setTemplateDocumentoAcionado] = useState(false);

    /*===========
       Arquivos
    =============*/
    const [arquivoDoc, setArquivoDoc] = useState<File[]>([]);
    const [arquivoCapa, setArquivoCapa] = useState<File[]>([]);

    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [previewCapa, setPreviewCapa] = useState<string | null>(null);

    const [alertarArquivo, setAlertarArquivo] = useState(false);

    const arquivosValidos = ["image/png", "image/jpeg", "image/webp"];

    /*==========================================
      Função para lidar com seleção de arquivos
    ============================================*/
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        if(selectedFiles.length === 0) return;

        const file = selectedFiles[0];

        if(templateCapaAcionado){

            if(!arquivosValidos.includes(file.type)){
                setArquivoCapa([file])
                setAlertarArquivo(true);
                return;
            }
            setAlertarArquivo(false);
            setArquivoCapa([file])

            // cria URL temporária para o preview
            const imageUrlCapa = URL.createObjectURL(file);
            setPreviewCapa(imageUrlCapa);


        }

        if(templateDocumentoAcionado){
            if(!arquivosValidos.includes(file.type)){
                setArquivoDoc([file])
                setAlertarArquivo(true);
                return;
            }
            setAlertarArquivo(false);
            setArquivoDoc([file])

            // cria URL temporária para o preview
            const imageUrlDoc = URL.createObjectURL(file);
            setPreviewDoc(imageUrlDoc);
        }
        
    };


    /*===================================
       Usuario Clicou em Criar Template
    ====================================*/
    function criarTemplate() {
        
        if(templateCapaAcionado){ // Se for CAPA

            if(nomeModeloTemplateCapa.trim() === ""){ // Se não tiver nome do Template, borda fica vermelhinha
                setAlertarNomeTemplateCapa(true);
                setTimeout(() => {
                    scrollTo({top : 0})
                }, 50);
            }

            if(arquivoCapa.length === 0){ // Se não tiver nenhum arquivo, borda fica vermelhinha
                setAlertarArquivoTemplateCapa(true);
                setTimeout(() => {
                    scrollTo({top : 0})
                }, 50);
            }

            if(nomeModeloTemplateCapa.trim() !== "" && arquivoCapa.length !== 0){

                /*==========================================
                    Função para envio da imagem ao servidor
                ============================================*/
                const formData = new FormData();
                
                formData.append("arquivo", arquivoCapa[0]);
                formData.append("nomeModelo", nomeModeloTemplateCapa);
                formData.append("tipo", "capa");
            
                api.post("/templates-pdf", formData)
                .then(() => {
                    setModalSucess(true);
                    setOverlay(true);
                })
                .catch(error => {
                    console.error("Erro no upload:", error);
                    alert("Erro no upload: " + mensagemErro(error));
                });

            }

        }

        if(templateDocumentoAcionado){ // Se for Documento

            if(nomeModeloTemplateDoc.trim() === ""){ // Se não tiver nome do Template, borda fica vermelhinha
                setAlertarNomeTemplateDoc(true);
                setTimeout(() => {
                    scrollTo({top : 0})
                }, 50);
            }

            if(arquivoDoc.length === 0){ // Se não tiver nenhum arquivo, borda fica vermelhinha
                setAlertarArquivoTemplateDoc(true);
                setTimeout(() => {
                    scrollTo({top : 0})
                }, 50);
            }

            if(nomeModeloTemplateDoc.trim() !== "" && arquivoDoc.length !== 0){

                /*==========================================
                    Função para envio da imagem ao servidor
                ============================================*/
                const formData = new FormData();
                
                formData.append("arquivo", arquivoDoc[0]);
                formData.append("nomeModelo", nomeModeloTemplateDoc);
                formData.append("tipo", "doc");
            
                api.post("/templates-pdf", formData)
                .then(() => {
                    setModalSucess(true);
                    setOverlay(true);
                })
                .catch(error => {
                    console.error("Erro no upload:", error);
                    alert("Erro no upload: " + mensagemErro(error));
                });

            }

        }
        
    };

    // Caso o nome do template ou o arquivo do template em CAPA não esteja mais vazio, ele tira a borda vermelha
        useEffect(() => {
            if(templateCapaAcionado){
                if(arquivoCapa.length !== 0){
                    setAlertarArquivoTemplateCapa(false);

                }
                if(nomeModeloTemplateCapa.trim() !== ""){
                    setAlertarNomeTemplateCapa(false);
                }
            }

        },[nomeModeloTemplateCapa, arquivoCapa])

        // Caso o nome do template ou arquivo de template em DOCUMENTO não esteja mais vazio, ele tira a borda vermelha
        useEffect(() => {
             if(templateDocumentoAcionado){
                if(arquivoDoc.length !== 0){
                    setAlertarArquivoTemplateDoc(false);

                }
                if(nomeModeloTemplateDoc.trim() !== ""){
                    setAlertarNomeTemplateDoc(false);
                }
            }
        }, [nomeModeloTemplateDoc, arquivoDoc])


    /*================================
        Usuário clicou em PDF
    ==================================*/
    function gerarPdf() {
        
        // ...
        
    };


    return(
        <div className="space-y-6 animate-fade-in">

            {/* ==========================================================================
            Cabeçalho principal -> breadcrumb (ou em    português, “trilha de navegação”).
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
                            Novo Template Orçamento
                        </BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>


            {/*==================================================
                SELECIONAR TEMPLATE CAPA OU TEMPLATE DOCUMENTO
            =====================================================*/}
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2">
                        <BookDashed className="w-6 h-6 text-blue-600"/>
                        <p className="text-gray-700 font-bold text-sm md:text-lg">Escolha o Tipo Do Template</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2 w-full">
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
                </CardContent>
             </Card>

                

            {/*=================
                CORPO DA PAGINA
            ====================*/}
            
                
            {/*TEMPLATE DA CAPA*/}
            {templateCapaAcionado && 
            <div className="flex flex-col lg:flex-row justify-between w-full gap-6 animate-slide-in">

                <Card className="w-full lg:w-[70%]">
                    <CardHeader>
                        <CardTitle>
                            <p className="text-gray-700 font-bold text-sm md:text-lg">Nome Do Template Da Capa</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[-5px]">
                        <Input 
                            value={nomeModeloTemplateCapa}  
                            onChange={(e) => setNomeModeloTemplateCapa(e.target.value)} 
                            placeholder="Defina o Nome Do Seu Template" 
                            className="focus:bg-white outline-none transition-all duration-200"
                            style=
                            {{
                                borderColor: alertarNomeTemplateCapa ? "red" : "",
                                boxShadow : alertarNomeTemplateCapa ? "0 4px 15px rgba(255, 0, 0, 0.3)" : "",
                            }}
                        />
                    </CardContent>

                    <CardHeader className="mt-[-20px]">
                        <CardTitle>
                            <p className="text-gray-700 font-bold text-sm md:text-lg">Realize O Download Do Template</p>
                            <p className="text-sm text-red-500 font-bold">* Formatos permitidos [PNG, JPG, JPEG e WEBP] *</p>
                        </CardTitle>
                    </CardHeader>
                            
                    <CardContent>
                        <div className="border border-gray-300 rounded-[5px] p-3 w-full bg-gradient-to-b from-white to-gray-50 shadow-sm hover:shadow-md transition-all"
                            style={{
                                borderColor: alertarArquivoTemplateCapa ? "red" : "",
                                boxShadow : alertarArquivoTemplateCapa ? "0 4px 15px rgba(255, 0, 0, 0.3)" : "",
                            }}>
                            <p className="font-semibold text-gray-700 mb-2 ml-1">Template</p>

                            {/* Área de arrastar e soltar */}
                            <div
                            className="flex flex-col items-center justify-center h-[230px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-300 ease-in-out bg-[#fafafa]"
                            onClick={() => document.getElementById("fileInput").click()}
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-400 mb-2 transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3" />
                            </svg>
                            <span className="text-gray-500 font-medium">Clique E Selecione Seu Template</span>
                            <span className="text-sm text-gray-400">Selecione O Arquivo</span>
                            </div>

                            {/* Input escondido */}
                            <input
                            id="fileInput"
                            type="file"
                            accept="image/png"
                            className="hidden"
                            onChange={handleFileChange}
                            />

                            {/* Lista de arquivos */}
                            <div className="file-list mt-4 space-y-2">
                            {arquivoCapa.map((file, index) => (
                                <div className="flex justify-between border border-[#d0d7de] p-2 rounded-[5px] flex gap-1">
                                    <div className="flex items-center gap-2">
                                        <FileEdit className="w-5 h-5 text-[#007bff]" />
                                        <p key={index} className="text-sm text-gray-700">{file.name}</p>
                                        {alertarArquivo && <p className="text-red-500 font-bold text-xs">** Arquivo Inválido - Somente [PNG, JPEG, JPG, WEBP] **</p>}
                                    </div>
                                    <div className="mr-3 bg-[#007bff] rounded-[5px] py-0.5 px-2 text-[#fff]">
                                        <button className="mt-0.5 cursor-pointer" 
                                            onClick={() => {
                                                setArquivoCapa([]); 
                                                setPreviewCapa(null);
                                        }}>X</button>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="mt-5">
                            <div className="flex flex-wrap justify-center gap-4 w-full">
                                <Button
                                    type="button"
                                    onClick={() => criarTemplate()}
                                    className="
                                        transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300" 
                                    >
                                    <span className="relative z-10 flex gap-1 justify-center">
                                        <Blocks className="w-9 h-9"/>
                                        Salvar Template
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <AlertDialog open={modalSucces} onOpenChange={setModalSucess}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <BadgeCheck className="text-blue-500 w-14 h-14" />
                                    <AlertDialogTitle>
                                        Sucesso!
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        O Template Da Capa Foi Criado Com Sucesso!
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => {navegate("/configuracoes"); scrollTo({top : 0})}}>Voltar</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>

                {/* Visualização Template documento*/}
                <div className="w-full lg:w-[30%] flex flex-col items-center justify-center h-[590px] border border-[#d1d5db] rounded-[5px] bg-white shadow-lg mr-5">
                    {!previewCapa && <Image className="w-16 h-16 text-[#cbd5e1]" />}
                    {!previewCapa && <p className="mt-3 text-[#9ca3af] text-2xl font-medium">Preview</p>}
                    {!previewCapa && <p className="text-[#9ca3af] text-sm font-medium">Faça o download para visualizar o preview.</p>}
                    {previewCapa && 
                    <img 
                        className="h-[590px] w-full"
                        src={previewCapa} 
                        alt="Papel timbrado Capa" />}
                </div>
                

            </div>}


            {/*TEMPLATE DO DOCUMENTO*/}
            {templateDocumentoAcionado && 
            <div className="flex flex-col lg:flex-row justify-between w-full mt-7 gap-6 animate-slide-in">

                <Card className="w-full lg:w-[65%]">
                    <CardHeader>
                        <CardTitle>
                            <p className="text-gray-700 font-bold text-sm md:text-lg">Nome Do Template Documento</p>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Input
                            value={nomeModeloTemplateDoc}  
                            onChange={(e) => setNomeModeloTemplateDoc(e.target.value)} 
                            placeholder="Defina o Nome Do Seu Template" 
                            className="transition-all duration-200 outline-none"
                            style=
                            {{
                                borderColor: alertarNomeTemplateDoc ? "red" : "",
                                boxShadow : alertarNomeTemplateDoc ? "0 4px 15px rgba(255, 0, 0, 0.3)" : "",
                            }}
                        />
                    </CardContent>
                    
                    <CardHeader className="mt-[-20px]">
                        <CardTitle>
                            <p className="text-gray-700 font-bold text-sm md:text-lg">Realize O Download Do Template</p>
                            <p className="text-sm text-red-500 font-bold">* Formatos permitidos [PNG, JPG, JPEG e WEBP] *</p>
                        </CardTitle>
                    </CardHeader>
                
                    <CardContent>
                        <div className="border border-gray-300 rounded-[5px] p-3 w-full bg-gradient-to-b from-white to-gray-50 shadow-sm hover:shadow-md transition-all" 
                        style={{
                            borderColor: alertarArquivoTemplateDoc ? "red" : "",
                            boxShadow : alertarArquivoTemplateDoc ? "0 4px 15px rgba(255, 0, 0, 0.3)" : "",
                        }}>
                            <p className="font-semibold text-gray-700 mb-2 ml-1">Template</p>

                            {/* Área de arrastar e soltar */}
                            <div
                            className="flex flex-col items-center justify-center h-[230px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-300 ease-in-out bg-[#fafafa]"
                            onClick={() => document.getElementById("fileInput").click()}
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-400 mb-2 transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3" />
                            </svg>
                            <span className="text-gray-500 font-medium">Clique E Selecione Seu Template</span>
                            <span className="text-sm text-gray-400">Selecione O Arquivo</span>
                            </div>

                            {/* Input escondido */}
                            <input
                            id="fileInput"
                            type="file"
                            accept="image/png"
                            className="hidden"
                            onChange={handleFileChange}
                            />

                            {/* Lista de arquivos */}
                            <div className="file-list mt-4 space-y-2">
                            {arquivoDoc.map((file, index) => (
                                <div className="flex justify-between border border-[#d0d7de] p-2 rounded-[5px] flex gap-1">
                                    <div className="flex items-center gap-2">
                                        <FileEdit className="w-5 h-5 text-[#007bff]" />
                                        <p key={index} className="text-sm text-gray-700">{file.name}</p>
                                        {alertarArquivo && <p className="text-red-500 font-bold text-xs">**Arquivo Inválido - Somente [PNG, JPEG, JPG, WEBP]**</p>}
                                    </div>
                                    <div className="mr-3 bg-[#007bff] rounded-[5px] py-0.5 px-2 text-[#fff]">
                                        <button className="mt-0.5 cursor-pointer" 
                                            onClick={() => {
                                                setArquivoDoc([]);
                                                setPreviewDoc(null)
                                            }}
                                        >X</button>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="mt-5">
                            <div className="flex flex-wrap justify-center gap-4 w-full">
                                <Button
                                    type="button"
                                    onClick={() => criarTemplate()}
                                    className="
                                        transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300" 
                                    >
                                    <span className="relative z-10 flex gap-1 justify-center">
                                        <Blocks className="w-6 h-6"/>
                                        Salvar Template
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <AlertDialog open={modalSucces} onOpenChange={setModalSucess}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <BadgeCheck className="text-blue-500 w-14 h-14" />
                                    <AlertDialogTitle>
                                        Sucesso!
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        O Template Do Docuemento Foi Criado Com Sucesso!
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => {navegate("/configuracoes"); scrollTo({top : 0})}}>Voltar</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </CardContent>
                </Card>

                {/* Visualização Template documento*/}
                <div className="w-full lg:w-[30%] flex flex-col items-center justify-center h-[590px] border border-[#d1d5db] rounded-[5px] bg-white shadow-lg mr-5">
                    {!previewDoc && <Image className="w-16 h-16 text-[#cbd5e1]" />}
                    {!previewDoc &&  <p className="mt-3 text-[#9ca3af] text-2xl font-medium">Preview</p>}
                    {!previewDoc &&  <p className="text-[#9ca3af] text-sm font-medium">Faça o download para visualizar o preview.</p>}
                    {previewDoc && 
                    <img 
                        className="h-[590px] w-full"
                        src={previewDoc} 
                        alt="Papel Timbrado Documento" 
                    />}
                </div> 
            </div>}
                
            
        </div>
    );

} 

export default Novo_Template_Orcamento;