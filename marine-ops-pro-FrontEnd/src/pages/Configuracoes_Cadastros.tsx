import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Home, FileText, FileUser, BadgeCheck, House, SmartphoneNfc, HardHat} from "lucide-react";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';



const Configuracoes_Cadastros: React.FC = () => {

    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState("funcionarios")
    const [modalSucces, setModalSucces] = useState(false);


    /*============================================
       Iniciamente, setando tudo como verdadeiro
    =============================================*/
    const camposBlocoPrincipal = {
        "Nome Completo" : "nomeCompleto",
        "Data De Nascimento" : "dataNascimento",
        "CPF" : "cpf",
        "RG" : "rg",
        "Gênero" : "genero",
        "Estado Civil" : "estadoCivil",
        "Nacionalidade" : "nacionalidade"
    };
    const camposBlocoEndereco = {
        "CEP" : "cep",
        "Logradouro" : "logradouro",
        "Número" : "numero",
        "Complemento" : "complemento",
        "Bairro" : "bairro",
        "Cidade" : "cidade",
        "Estado" : "estado"
    }
    const camposBlocoContato = {
        "Telefone Primário" : "telefone1",
        "Telefone Secundário" : "telefone2",
        "Email" : "email"
    }
    const camposBlocoDadosProfissionais = {
        "Função/Cargo" : "funcaoCargo",
        "Departamento/Setor" : "departamentoSetor",
        "Tipo Contrato" : "tipoContrato",
        "Salário Base" : "salarioBase",
        "Jornada Trabalho" : "jornadaTrabalho",
        "Supervisor Responsável" : "supervisorResponsavel"
    }
    const camposBlocoDocumento = {
        "Aparecer Bloco Documento" : "documento",
        "Aparecer Bloco Certificações" : "certificacoes"
    }
    const [config, setConfig] = useState({
        principal : {
            mostrarBloco : true,
            nomeCompleto : false,
            dataNascimento : false,
            cpf : true,
            rg : true, 
            genero : true,
            estadoCivil : true,
            nacionalidade : true,
        },
        endereco : {
            mostrarBloco : true,
            cep : true,
            logradouro : true,
            numero : true,
            complemento : true,
            bairro : true,
            cidade : true,
            estado : true
        },
        contato : {
            mostrarBloco : true,
            telefone1 : true,
            telefone2 : true,
            email : true
        },
        dadosProfissionais : {
            mostrarBloco : true,
            funcaoCargo : true,
            departamentoSetor : true,
            tipoContrato : true,
            salarioBase : true,
            jornadaTrabalho : true,
            supervisorResponsavel : true
        },
        documento : {
            documentosFuncionario : true
        },
        certificacoes : {
            certificacoesFuncionario : true
        }
    })

    /*=====================================================================
       Pegando as Configurações do Cadastro de Funcionário na base de Dados
    =======================================================================*/
    
    useEffect(() => {
        
        fetch("http://localhost/marine-ops-BackEnd/funcionario/retornar_configuracao.php")
        .then(res => res.json())
        .then(data => {
            setConfig(data)
        })

    }, []);

    
    /*=====================================================================
       Salavando as Configações do Cadastro de Funcionário na base de Dados
    =======================================================================*/
    function salvarConfiguracoes(tela : number){

        fetch("http://localhost/marine-ops-BackEnd/funcionario/update_config.php", {
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body : JSON.stringify({
                tela : tela,
                config : config
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "Certo"){
                setModalSucces(true);
            }else if(data.status = "Errado"){
                alert("Deu errado");
            }
        })
        .catch((err) => console.error("Erro ao atualizar configuração " + err));

    }

    return(
        <div className="space-y-6 animate-fade-in">

        <AlertDialog open={modalSucces} onOpenChange={setModalSucces}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <BadgeCheck className="text-blue-500 w-14 h-14" />
                    <AlertDialogTitle>
                        Sucesso!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Configurações Da Tela De Cadastro De Funcionários Salvas Com Êxito!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {navigate("/Configuracoes_Cadastros"); scrollTo({top: 0})}}>Voltar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        <Home className="w-4 h-4 text-blue-600"/>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink className="pointer" onClick={() => {navigate("/configuracoes"); scrollTo({top : 0})}}>
                        <p className="cursor-pointer">Configurações</p>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        Personalizar Cadastros
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
            
            
        <Card className="w-full rounded-2xl overflow-hidden shadow-sm">


            {/* Conteúdo */}
            <div className="p-6 bg-gray-50">
                {activeMenu === "funcionarios" && (
                <div>
                    <Tabs defaultValue="funcionarios" className="w-full">

                        <TabsList className="grid grid-cols-3 w-full bg-white rounded-lg p-2 border border-[#eee] h-14">
                            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
                            <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
                            <TabsTrigger value="clientes">Clientes</TabsTrigger>
                        </TabsList>


                        {/* Aba Principais */}
                        <TabsContent value="funcionarios" className="mt-6">

                            <h2 className="text-2xl font-semibold text-gray-600 pl-2">Cadastro de Funcionários</h2>
                            <p className="text-gray-500 text-sm mb-6 pl-2">Selecione os campos que devem aparecer no cadastro.</p>

                            <Card className="p-4 shadow-none border rounded-xl bg-white">
                                <CardTitle className="text-gray-700 p-2 flex gap-2"><FileUser className="w-6 h-6 text-blue-600"/>Informações Principais</CardTitle>
                                <span className="text-gray-500 text-xs md:text-sm pl-2">Selecione os campos do bloco principal que devem aparecer no cadastro do funcionário</span>


                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    {Object.entries(camposBlocoPrincipal).map(([label, key]) => (
                                        <div key={key} className="flex items-center justify-between p-3 border-b border-b-[#eee]">
                                        <span className="text-gray-700 text-sm">{label}</span>

                                        <Switch
                                            checked={config.principal[key]}
                                            onCheckedChange={(valor) =>
                                            setConfig(prev => ({
                                                ...prev,
                                                principal: {
                                                ...prev.principal,
                                                [key]: valor
                                                }
                                            }))
                                            }
                                        />
                                        </div>
                                    ))}
                                </div>
                                                                    
                                <CardTitle className="text-gray-700 mt-10 p-2 flex items-center gap-2"><House className="w-6 h-6 text-blue-600"/>Informações Endereço</CardTitle>
                                <span className="text-gray-500 text-xs md:text-sm pl-2">Selecione os campos do bloco endereço que devem aparecer no cadastro do funcionário</span>

                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    {Object.entries(camposBlocoEndereco).map(([label, key]) => (
                                        <div key={key} className="flex items-center justify-between p-3 border-b border-b-[#eee]">
                                        <span className="text-gray-700 text-sm">{label}</span>

                                        <Switch
                                            checked={config.endereco[key]}
                                            onCheckedChange={(valor) =>
                                            setConfig(prev => ({
                                                ...prev,
                                                endereco: {
                                                ...prev.endereco,
                                                [key]: valor
                                                }
                                            }))
                                            }
                                        />
                                        </div>
                                    ))}
                                </div>

                                <CardTitle className="text-gray-700 mt-10 pl-2 flex items-center gap-2"><SmartphoneNfc className="w-7 h-7 text-blue-600" />Informações Contato</CardTitle>
                                <span className="text-gray-500 text-xs md:text-sm pl-2">Selecione os campos do bloco contatos que devem aparecer no cadastro do funcionário</span>

                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    {Object.entries(camposBlocoContato).map(([label, key]) => (
                                        <div key={key} className="flex items-center justify-between p-3 border-b border-b-[#eee]">
                                        <span className="text-gray-700 text-sm">{label}</span>

                                        <Switch
                                            checked={config.contato[key]}
                                            onCheckedChange={(valor) =>
                                            setConfig(prev => ({
                                                ...prev,
                                                contato: {
                                                ...prev.contato,
                                                [key]: valor
                                                }
                                            }))
                                            }
                                        />
                                        </div>
                                    ))}
                                </div>

                                <CardTitle className="text-gray-700 mt-10 p-2 flex gap-2"><HardHat className="w-6 h-6 text-blue-600"/>Dados Profissionais</CardTitle>
                                <span className="text-gray-500 text-xs md:text-sm pl-2">Selecione os campos do bloco dados profissionais que devem aparecer no cadastro do funcionário</span>

                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    {Object.entries(camposBlocoDadosProfissionais).map(([label, key]) => (
                                        <div key={key} className="flex items-center justify-between p-3 border-b border-b-[#eee]">
                                        <span className="text-gray-700 text-sm">{label}</span>

                                        <Switch
                                            checked={config.dadosProfissionais[key]}
                                            onCheckedChange={(valor) =>
                                            setConfig(prev => ({
                                                ...prev,
                                                dadosProfissionais : {
                                                ...prev.dadosProfissionais,
                                                [key]: valor
                                                }
                                            }))
                                            }
                                        />
                                        </div>
                                    ))}
                                </div>

                                <CardTitle className="text-gray-700 mt-10 p-2 flex gap-2"><FileText className="w-6 h-6 text-blue-600"/>Documentos E Cerificações</CardTitle>
                                <span className="text-gray-500 text-xs md:text-sm pl-2">Bloco documentos aparecer na tela de cadastro de funcionário</span>

                                <div className="grid grid-cols-1 gap-4 mt-5">
                                    <div className="flex justify-between items-center border-b border-b-[#eee] pb-3">
                                        <span className="text-gray-700 text-sm">Aparecer Bloco Documentos</span>
                                        <Switch 
                                        checked={config.documento.documentosFuncionario}
                                        onCheckedChange={(valor) => {
                                            setConfig(prev => ({
                                                ...prev,
                                                documento : {
                                                    ...prev.documento,
                                                    documentosFuncionario : valor
                                                }
                                            }))
                                        }}
                                        />
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                    <span className="text-gray-700 text-sm">Aparecer Bloco Certificações</span>
                                    <Switch 
                                    checked={config.certificacoes.certificacoesFuncionario}
                                    onCheckedChange={(valor) => {
                                        setConfig(prev => ({
                                            ...prev,
                                            certificacoes : {
                                                ...prev.certificacoes,
                                                certificacoesFuncionario : valor
                                            }
                                        }))
                                    }}
                                    />
                                    </div>
                                </div>
                            </Card>
                                    

                        </TabsContent>
                    </Tabs>
                </div>
                )}
            </div>
            <div className="text-center pb-3">
                <Button 
                    className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={() => salvarConfiguracoes(1)}>
                        Salvar Configurações
                </Button>
            </div>
        </Card>


        </div>
    );

}

export default Configuracoes_Cadastros;