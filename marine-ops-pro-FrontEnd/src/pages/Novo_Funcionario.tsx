
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, BookUser, House, UserPen, Folder, ShieldCheck, Timer, FileEdit, Upload, Download, Eye, Trash, Medal, BadgeCheck } from "lucide-react";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar,AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useLocation } from "react-router-dom";
import { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import InputMask from 'react-input-mask';


const Novo_Funcionario: React.FC = () => {

    const navegate = useNavigate();

     /*==================================================================================================
    Veirificando se é criar orçamento, ou editar orçamento (Vai estar na url acao=editar ou acao=criar)
    ====================================================================================================*/
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const acao = queryParams.get("acao"); // "criar" ou "editar"
    const codigoFuncionario = queryParams.get("codigo");


    const [modalSucces, setModalSucces] = useState(false);

    /*================================================NOVO FUNCIONARIO========================================================*/
   /*==============================================================
        Variáveis de Estado Informações Principais Do Funcionário
    ===============================================================*/
    const [nomeFuncionario, setNomeFuncionario] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [genero, setGenero] = useState("");
    const [estadoCivil, setEstadoCivil] = useState("");
    const [nacionalidade, setNacionalidade] = useState(""); 

    /*==============================================================
        Variáveis de Estado Endereço Do Funcionário
    ===============================================================*/
    const [cep, setCep] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");

    const [cidadeSelecionado, setCidadeSelecionada] = useState("");
    const [cidade, setCidade] = useState([]);
    const [estadoSelecionado, setEstadoSelecionado] = useState("");
    const [estado, setEstado] = useState([]);

    /*============================================
        Variáveis de Estado Contatos Funcionário
    ==============================================*/
    const [telefone1, setTelefone1] = useState("");
    const [telefone2, setTelefone2] = useState("");
    const [email, setEmail] = useState("");

    /*============================================
        Variáveis de Estado Dados Profissionais
    ===========================================*/
    const [funcaoCargo, setFuncaoCargo] = useState("");
    const [departamentoSetor, setDepartamentoSetor] = useState("");
    const [contrato, setContrato] = useState("");
    const [salario, setSalario] = useState("");

    /*==============
        Arquivos
    ================*/
    const [arquivosFunc, setArquivosFunc] = useState<File[]>([]);
    const [docsOpen, setDocsOpen] = useState(false);

    /*=================
        Certificações
    ===================*/
    const [arquivosCertificao, setArquivosCertificacao] = useState<File[]>([]);
    const [certificacaoOpen, setCertificacaoOpen] = useState(false);


    /*================================================EDITAR FUNCIONÁRIO========================================================*/
    /*==============================================================
        Variáveis de Estado Informações Principais Do Funcionário
    ===============================================================*/
    const [nomeFuncionarioEditar, setNomeFuncionarioEditar] = useState("");
    const [dataNascimentoEditar, setDataNascimentoEditar] = useState("");
    const [cpfEditar, setCpfEditar] = useState("");
    const [rgEditar, setRgEditar] = useState("");
    const [generoEditar, setGeneroEditar] = useState("");
    const [estadoCivilEditar, setEstadoCivilEditar] = useState("");
    const [nacionalidadeEditar, setNacionalidadeEditar] = useState(""); 

    /*==============================================================
        Variáveis de Estado Endereço Do Funcionário
    ===============================================================*/
    const [cepEditar, setCepEditar] = useState("");
    const [logradouroEditar, setLogradouroEditar] = useState("");
    const [numeroEditar, setNumeroEditar] = useState("");
    const [complementoEditar, setComplementoEditar] = useState("");
    const [bairroEditar, setBairroEditar] = useState("");

    const [cidadeSelecionadoEditar, setCidadeSelecionadaEditar] = useState("");
    const [cidadeEditar, setCidadeEditar] = useState([]);
    const [estadoSelecionadoEditar, setEstadoSelecionadoEditar] = useState("");
    const [estadoEditar, setEstadoEditar] = useState([]);

    /*============================================
        Variáveis de Estado Contatos Funcionário
    ==============================================*/
    const [telefone1Editar, setTelefone1Editar] = useState("");
    const [telefone2Editar, setTelefone2Editar] = useState("");
    const [emailEditar, setEmailEditar] = useState("");

    /*============================================
        Variáveis de Estado Dados Profissionais
    ===========================================*/
    const [funcaoCargoEditar, setFuncaoCargoEditar] = useState("");
    const [departamentoSetorEditar, setDepartamentoSetorEditar] = useState("");
    const [contratoEditar, setContratoEditar] = useState("");
    const [salarioEditar, setSalarioEditar] = useState("");


    if(acao === "editar"){

        const codigo = codigoFuncionario

        fetch(`http://localhost/marine-ops-BackEnd/funcionario/retornar_funcionario.php?codigo=${codigo}`)
        .then(res => res.json())
        .then(data => {
            setNomeFuncionarioEditar(data.nome);
            setDataNascimentoEditar(data.data_nascimento);
            setCpfEditar(data.cpf);
            setRgEditar(data.rg);
            setGeneroEditar(data.genero);
            setEstadoCivilEditar(data.estado_civil);
            setNacionalidadeEditar(data.nacionalidade);
            setEstadoEditar(data.estado);
            setCidadeEditar(data.cidade);
            setCepEditar(data.cep);
            setLogradouro(data.logradouro);
            setComplementoEditar(data.complemento);
            setNumeroEditar(data.numero);
            setBairroEditar(data.bairro);
            setFuncaoCargoEditar(data.funcao_cargo);
            setDepartamentoSetorEditar(data.departamento_setor);
            setContratoEditar(data.contrato);
            setSalarioEditar(data.salario_base);
            setTelefone1Editar(data.telefone_principal);
            setTelefone2Editar(data.telefone_secundario);
            setEmail(data.email);
        })

    }

    /*=======================================
       Configurações Tela De Novo Funcionário
    =========================================*/
    const [config, setConfig] = useState({
        principal : {
            mostrarBloco : true,
            nomeCompleto : false,
            dataNascimento : true,
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

    /*======================================================================
      Pegando as Configurações De Tela De Novo Funcionário na base De dados
    =======================================================================*/
    useEffect(() => {

        fetch("http://localhost/marine-ops-BackEnd/funcionario/retornar_configuracao.php")
        .then(res => res.json())
        .then(data => {

            // Verificando se todas os campos do bloco estão como false, se sim, não mostra o bloco
            const blocos = ["principal", "endereco", "contato", "dadosProfissionais","documento","certificacoes"];
            const novoConfig = { ...data };

            blocos.forEach(bloco => {
                const chaves = Object.keys(novoConfig[bloco]).filter(k => k !== "mostrarBloco");
                const allFalse = chaves.every(key => novoConfig[bloco][key] === false);
                novoConfig[bloco].mostrarBloco = !allFalse;
            });

            setConfig(novoConfig);

        });

    });

    /*========================================================
     Função para lidar com seleção de arquivos Dos Documentos
    ==========================================================*/
    const handleFileChangeDocumentos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        if(selectedFiles.length === 0) return;

        setArquivosFunc(prev => [...prev, ...selectedFiles]);
    };

    /*=================================
       Função para remover os arquivos
    ===================================*/
    const removeArquivoDocumentos = (indexToRemove) => {
        setArquivosFunc(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    /*=========================================================
     Função para lidar com seleção de arquivos Das cerificações
    ==========================================================*/
    const handleFileChangeCertificacoes = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        if(selectedFiles.length === 0) return;

        setArquivosCertificacao(prev => [...prev, ...selectedFiles]);
    };

    /*===============================
     Função para remover os arquivos
    =================================*/
    const removeArquivoCertificacoes = (indexToRemove) => {
        setArquivosCertificacao(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    /*===============================
        Pegando todos Os Estado
    =================================*/
    useEffect(() => {

        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
        .then(res => res.json())
        .then(data => setEstado(data))
        .catch(err => console.error("Erro ao carregar Estados"))

    }, [])

    /*============================================================================
      A partir do Momento que o usuário selecionar o estado, aparecer as cidades
    ==============================================================================*/
    useEffect(() => {

        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionadoEditar ? estadoSelecionadoEditar : estadoSelecionado}/municipios`)
        .then(res => res.json())
        .then(data => setCidade(data))
        .catch(err => console.error("Erro ao carregar Cidades"))

    }, [estadoSelecionado, estadoSelecionadoEditar]);


    const salvarNovoFuncionario = (e) => {
        e.preventDefault();

        const dados = new FormData(e.target);

        fetch("http://localhost/marine-ops-BackEnd/funcionario/insert_funcionario.php", {
            method: "POST",
            body : dados
        })
        .then(res => res.json())
        .then(data => {
             if(data.msg === "Sucesso"){
                setModalSucces(true);
             }else{
                alert(data.msg);
             }
        })
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
                            Funcionário Cadastrado Com Êxito!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {navegate("/Novo_Funcionario"); scrollTo({top: 0})}}>Voltar</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/*===========================================================================
               Cabeçalho principal -> breadcrumb (“trilha de navegação”).
            ==============================================================================*/}
            <div className="flex flex-col md:flex-row justify-between items-center">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" >
                            <Home className="w-4 h-4 text-blue-600 cursor-pointer" />
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => {navegate("/Funcionarios"); scrollTo({top : 0}) }} >
                                <p className="cursor-pointer">Funcionários</p>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>
                            Novo Funcionário
                        </BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center gap-2 px-10 py-1 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 shadow-sm mt-4 md:mt-0">
                    <Timer className="w-5 h-5 text-blue-600"/>
                    <span className="text-[14px] hidden md:block">
                        Criação em <strong className="text-gray-700">20/09/08</strong> às <strong className="text-gray-700">18:54:21</strong> por 
                        <strong className="text-gray-700"> Arthur</strong>
                    </span>
                    <span className="text-[14px] block md:hidden">
                        <strong className="text-gray-700">Criação: 20/09/08 18:54 Arthur</strong>
                    </span>
                </div>
            </div>
            
            <form onSubmit={salvarNovoFuncionario}>

                <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all rounded-2xl border border-gray-200 bg-gradient-to-br from-[#f7f7f7] to-gray-50 px-4 md:px-10 pt-2 pb-10">

                    <CardTitle className="flex flex-col md:flex-row justify-between items-center mt-2 ml-2">
                        <div className="flex justify-center items-center gap-3">
                            <span className="text-gray-600 text-[18px]">Informações Para Cadastrar Novo Colaborador Da Empresa</span>
                            
                        </div>
                        <div className="flex gap-2 mt-5 md:mt-0">
                            <Button 
                                className="w-full md:w-[140px] transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none"
                                type="submit"
                                >
                                Salvar
                            </Button>
                            <Button className="w-full md:w-[140px] transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none ">Cancelar</Button>
                        </div>
                    </CardTitle>
                

                    {config.principal.mostrarBloco && <Card className="flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow rounded-2xl border border-gray-200 mt-3">
                    
                        <CardContent className="p-0 basis-1/4 pb-4 border-r border-r-[#efefef]">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex gap-2 items-center">
                                    <BookUser className="w-6 h-6 text-blue-600" />
                                    <span className="text-gray-800 font-semibold text-base md:text-lg tracking-wide">
                                        Informações Principais
                                    </span>
                                </CardTitle>
                                <p className="text-gray-500 text-xs md:text-sm pl-8">Dados Gerais Do Colaborador</p>
                            </CardHeader>
                            
                            {/* FOTO */}
                            <div className="flex justify-center items-start">
                                <div className="
                                    relative h-[140px] w-[140px] md:h-[180px] md:w-[180px] 
                                    rounded-full border-[3px] border-blue-100 
                                    bg-gradient-to-br from-gray-50 to-gray-200 
                                    shadow-inner flex items-center justify-center 
                                    cursor-pointer transition-all 
                                    hover:scale-[1.02] hover:shadow-lg hover:border-blue-300
                                ">
                                    <span className="text-gray-500 font-medium text-sm text-center">
                                        Adicionar<br />Foto
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        

                        <CardContent className="pt-6 flex flex-col items-center md:flex-row gap-8 bg-[#f9f9f9] basis-3/4">

                            {/* CAMPOS */}
                            <div className="flex flex-col gap-4 w-full">

                                {config.principal.nomeCompleto && <Input
                                    name="nome_completo"
                                    value={nomeFuncionarioEditar ? nomeFuncionarioEditar : nomeFuncionario}
                                    onChange={(e) => nomeFuncionarioEditar ? setNomeFuncionarioEditar(e.target.value) : setNomeFuncionario(e.target.value)}
                                    placeholder="Nome Completo do Funcionário *"
                                    className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />}

                                <div className="flex flex-col  md:flex-row gap-4">
                                    {config.principal.dataNascimento && <InputMask
                                        name="data_nascimento"
                                        mask="99/99/9999"
                                        value={dataNascimentoEditar ? dataNascimentoEditar : dataNascimento}
                                        onChange={(e) => dataNascimentoEditar ? setDataNascimentoEditar(e.target.value) : setDataNascimento(e.target.value)}
                                    >
                                        {(inputProps) => (
                                            <Input 
                                            {...inputProps} 
                                            className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                                            placeholder="Data de Nascimento" />
                                        )}
                                    </InputMask>}
                                    {config.principal.cpf && <InputMask
                                        name="cpf"
                                        mask="999.999.999-99"
                                        value={cpfEditar ? cpfEditar : cpf}
                                        onChange={(e) => cpfEditar ? setCpfEditar(e.target.value) : setCpf(e.target.value)}
                                    >
                                        {(inputProps) => (
                                            <Input
                                                {...inputProps}
                                                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                placeholder="CPF"
                                            />
                                        )}
                                    </InputMask>}
                                    {config.principal.rg && <InputMask
                                        name="rg"
                                        mask="99.999.999-9"
                                        value={rgEditar ? rgEditar : rg}
                                        onChange={(e) => rgEditar ? setRgEditar(e.target.value) : setRg(e.target.value)}
                                    >
                                        {(inputProps) => (
                                            <Input 
                                            {...inputProps} 
                                            className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500" 
                                            placeholder="RG" />
                                        )}
                                    </InputMask>}

                                </div>

                                <div className="flex flex-col md:flex-row gap-4">
                                    {config.principal.genero && <Select name="genero" value={generoEditar ? generoEditar : genero} onValueChange={generoEditar ? setGeneroEditar : setGenero }>
                                        <SelectTrigger className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500">
                                            <SelectValue placeholder="Gênero" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Masculino</SelectItem>
                                            <SelectItem value="F">Feminino</SelectItem>
                                        </SelectContent>
                                    </Select>}

                                    {config.principal.estadoCivil && <Select name="estado_civil" value={estadoCivilEditar ? estadoCivilEditar : estadoCivil} onValueChange={estadoCivilEditar ? setEstadoCivilEditar : setEstadoCivil}>
                                        <SelectTrigger className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500">
                                            <SelectValue placeholder="Estado Civil" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="S">Solteiro</SelectItem>
                                            <SelectItem value="C">Casado</SelectItem>
                                            <SelectItem value="D">Divorciado</SelectItem>
                                            <SelectItem value="V">Viúvo</SelectItem>
                                            <SelectItem value="U">União estável</SelectItem>
                                        </SelectContent>
                                    </Select>}
                                </div>

                                <div className="flex items-center gap-4">
                                    {config.principal.nacionalidade && <Input
                                        name="nacionalidade"
                                        placeholder="Nacionalidade"
                                        value={nacionalidadeEditar ? nacionalidadeEditar : nacionalidade}
                                        onChange={(e) => nacionalidadeEditar ? setNacionalidadeEditar(e.target.value) : setNacionalidade(e.target.value)}
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>}

                    <div className="flex flex-col md:flex-row gap-10 mt-6">
                        <div className="basis-1/2">
                            {config.endereco.mostrarBloco && <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all rounded-2xl border border-gray-200 bg-white">

                                <CardHeader>
                                    <CardTitle className="flex gap-2">
                                        <House className="w-6 h-6 text-blue-600 "/>
                                        <span className="text-gray-800 font-bold text-sm md:text-lg">Endereço do Funcionário</span>
                                    </CardTitle>
                                    <span className="text-gray-500 text-xs md:text-sm pl-8">Informe O Residencial Do Funcionário</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col md:flex-row items-center gap-2">
                                        {config.endereco.estado && 
                                        <select value={estadoSelecionadoEditar ? estadoSelecionadoEditar : estadoSelecionado} onChange={(e) => estadoSelecionadoEditar ? setEstadoSelecionadoEditar(e.target.value) : setEstadoSelecionado(e.target.value)}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                                        >
                                            {estado.map((estado) => (
                                                <option value={estado.sigla} id={estado.key}>{estado.nome}</option>
                                            ))}
                                        </select>}

                                        {config.endereco.cidade &&
                                            <select 
                                            value={cidadeSelecionadoEditar ? cidadeSelecionadoEditar : cidadeSelecionado} 
                                            onChange={(e) => cidadeSelecionadoEditar ? setCidadeSelecionadaEditar(e.target.value) : setCidadeSelecionada(e.target.value)}
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                            >
                                                {cidade.map((cidade) => (
                                                    <option 
                                                     value={cidade.nome}
                                                    >{cidade.nome}</option>
                                                ))}
                                            </select>
                                        }
                                    </div>
                                    {config.endereco.cep && <Input 
                                        name="cep"
                                        placeholder="CEP" 
                                        value={cepEditar ? cepEditar : cep} 
                                        onChange={(e) => cepEditar ? setCepEditar(e.target.value) : setCep(e.target.value)} 
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4" 
                                    />}

                                    {config.endereco.logradouro && <Input 
                                        name="logradouro"
                                        placeholder="Logradouro" 
                                        value={logradouroEditar ? logradouroEditar : logradouro} 
                                        onChange={(e) => logradouroEditar ? setLogradouroEditar(e.target.value) : setLogradouro(e.target.value)} 
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4" 
                                    />}

                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="basis-2/3">
                                            {config.endereco.complemento && <Input 
                                                name="complemento"
                                                placeholder="Complemento" 
                                                value={complementoEditar ? complementoEditar : complemento} 
                                                onChange={(e) => complementoEditar ? setComplementoEditar(e.target.value) : setComplemento(e.target.value)} 
                                                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
                                            />}
                                        </div>
                                        
                                        <div className="basis-1/3">
                                            {config.endereco.numero && <Input 
                                                name="numero"
                                                placeholder="Numero" 
                                                value={numeroEditar ? numeroEditar : numero} 
                                                onChange={(e) => numeroEditar ? setNumeroEditar(e.target.value) : setNumero(e.target.value)}
                                                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-2 md:mt-4"
                                            />}
                                        </div>
                                    </div>
                                    
                                    {config.endereco.bairro && <Input 
                                        name="bairro"
                                        placeholder="Bairro" 
                                        value={bairroEditar ? bairroEditar : bairro} 
                                        onChange={(e) => bairroEditar ? setBairro(e.target.value) : setBairro(e.target.value)} 
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
                                    />}
                                
                                    
                                </CardContent>
                            </Card>}

                            {config.contato.mostrarBloco && <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all rounded-2xl border border-gray-200 bg-white mt-6">
                                <CardHeader>
                                    <CardTitle className="flex gap-2">
                                        <House className="w-6 h-6 text-blue-600 "/>
                                        <span className="text-gray-800 font-bold text-sm md:text-lg">Contatos</span>
                                    </CardTitle>
                                    <span className="text-gray-500 text-xs md:text-sm pl-8">Informe os contatos do Funcionário</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        {config.contato.telefone1 && <InputMask
                                            name="telefone1"
                                            mask="(99) 99999-9999"
                                            value={telefone1Editar ? telefone1Editar : telefone1}
                                            onChange={(e) => telefone1Editar ? setTelefone1Editar(e.target.value) : setTelefone1(e.target.value)}
                                        >
                                            {(inputProps) => (
                                                <Input 
                                                {...inputProps}  
                                                placeholder="Telefone 1" 
                                                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                />
                                            )}
                                        </InputMask>}
                                        
                                        {config.contato.telefone2 && <InputMask
                                            name="telefone2"
                                            mask="(99) 99999-9999"
                                            value={telefone2Editar ? telefone2Editar : telefone2}
                                            onChange={(e) => telefone2Editar ? setTelefone2Editar(e.target.value) : setTelefone2(e.target.value)}
                                        >
                                            {(inputProps) => (
                                                <Input 
                                                {...inputProps}  
                                                placeholder="Telefone 2" 
                                                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                />
                                            )}
                                        </InputMask>}
                                        
                                    </div>
                                    {config.contato.email && <Input 
                                        name="email"
                                        placeholder="Email" 
                                        value={emailEditar ? emailEditar : email} 
                                        onChange={(e) => emailEditar ? setEmailEditar(e.target.value) : setEmail(e.target.value)} 
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
                                    />}
                                </CardContent>
                            </Card>}
                        </div>

                        {config.dadosProfissionais.mostrarBloco && <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all rounded-2xl border border-gray-200 bg-white basis-1/2">

                            <CardHeader>
                                <CardTitle className="flex gap-2">
                                    <UserPen className="w-6 h-6 text-blue-600"/>
                                    <span className="text-gray-800 font-bold text-sm md:text-lg">Dados Profissionais</span>
                                </CardTitle>
                                <span className="text-gray-500 text-xs md:text-sm pl-8">Informa Sobre O Profissional Do Funcionário</span>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col md:flex-row gap-2">
                                    {config.dadosProfissionais.funcaoCargo && <Input 
                                        name="funcao_cargo"
                                        placeholder="Função/Cargo" 
                                        value={funcaoCargoEditar ? funcaoCargoEditar : funcaoCargo} 
                                        onChange={(e) => funcaoCargoEditar ? setFuncaoCargoEditar(e.target.value) : setFuncaoCargo(e.target.value)} 
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    />}
                                    {config.dadosProfissionais.departamentoSetor && <Input 
                                        name="departamento_setor"
                                        placeholder="Departamento/Setor" 
                                        value={departamentoSetorEditar ? departamentoSetorEditar : departamentoSetor} 
                                        onChange={(e) => departamentoSetorEditar ? setDepartamentoSetorEditar(e.target.value) : setDepartamentoSetor(e.target.value)} 
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-2 md:mt-0"
                                    />}
                                </div>
                                {config.dadosProfissionais.tipoContrato && <Input 
                                    name="tipo_contrato"
                                    placeholder="Tipo De Contrato" 
                                    value={contratoEditar ? contratoEditar : contrato} 
                                    onChange={(e) => contratoEditar ? setContratoEditar(e.target.value) : setContrato(e.target.value)} 
                                    className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
                                />}

                                {config.dadosProfissionais.salarioBase && <Input 
                                    name="salario_base"
                                    placeholder="Salário Base" 
                                    value={salarioEditar ? salarioEditar : salario} 
                                    onChange={(e) => salarioEditar ? setSalarioEditar(e.target.value) : setSalario(e.target.value)} 
                                    className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 mt-4"
                                />}
                                
                            </CardContent>
                        </Card>}
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-6">

                        {config.documento.documentosFuncionario && <div className="basis-1/2">
                            <Card className="shadow-sm hover:shadow-md transition-shadow rounded-2xl border border-gray-200">
                                <CardHeader className="mb-[-10px]">
                                    <CardTitle className="flex gap-2 justify-between">
                                        <div className="flex items-center gap-2">
                                            <Folder  className="w-6 h-6 text-blue-600 " />
                                            <span className="text-gray-800 font-bold text-sm md:text-lg">Documentos</span>
                                        </div>
                                        <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="h-8 mt-[-4px] transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none">Inserir Documentos</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Inserir Documento</DialogTitle>
                                                </DialogHeader>
                                                <div className="border border-gray-300 rounded-[5px] p-3 w-full bg-gradient-to-b from-white to-gray-50 shadow-sm hover:shadow-md transition-all">
                                                
                                                    <p className="font-semibold text-gray-700 mb-2 ml-1">Documentos Funcionário</p>
                        
                                                    {/* Área de arrastar e soltar */}
                                                    <div
                                                        className="flex flex-col items-center justify-center h-[230px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-300 ease-in-out bg-[#fafafa]"
                                                        onClick={() => document.getElementById("fileInputDocumentos").click()}
                                                    >
                                                    <Upload className="h-10 w-10 text-gray-400 mb-2 transition-colors" />
                                                    <span className="text-gray-500 font-medium">Clique Para Selecionar O Arquivo</span>
                                                    <span className="text-sm text-gray-400">Selecione O Arquivo</span>
                                                    </div>
                        
                                                    {/* Input escondido */}
                                                    <input
                                                    id="fileInputDocumentos"
                                                    type="file"
                                                    accept="image/png"
                                                    className="hidden"
                                                    multiple
                                                    onChange={handleFileChangeDocumentos}
                                                    />
                        
                                                    {/* Lista de arquivos */}
                                                    <div className=" gap-3 mt-4 space-y-2 max-h-[225px] overflow-auto">
                                                    {arquivosFunc.map((file, index) => (

                                                        <div className="flex items-center justify-between border border-gray-300 px-3 py-1.5 rounded-xl bg-white shadow-sm hover:shadow transition-all ">
                                                            {/* Ícone + nome do arquivo */}
                                                            <div className="flex items-center gap-2">
                                                                <FileEdit className="w-5 h-5 text-blue-600" />
                                                                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                                            </div>

                                                            {/* Ações */}
                                                            <div className="flex items-center">

                                                                {/* Visualizar */}
                                                                <button
                                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                                    title="Visualizar"
                                                                >
                                                                    <Eye className="w-5 h-5 text-gray-700" />
                                                                </button>

                                                                {/* Download */}
                                                                <button
                                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                                    title="Baixar"
                                                                >
                                                                    <Download className="w-5 h-5 text-gray-700" />
                                                                </button>

                                                                {/* Remover */}
                                                                <button
                                                                    onClick={() => removeArquivoDocumentos(index)}
                                                                    className="p-2 rounded-lg hover:bg-red-100 transition"
                                                                    title="Remover"
                                                                >
                                                                    <Trash className="w-5 h-5 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </CardTitle>
                                    <p className="text-gray-500 text-xs md:text-sm pl-8">Informe Os Documentos Do Funcionário</p>
                                </CardHeader>
                                <CardContent>
                                    {arquivosFunc.length === 0 && <p className="text-center text-gray-600 text-sm mt-5">Nenhum Arquivo Encontrado</p>}
                                    {arquivosFunc.map((file, index) => (
                                        
                                        <div className="flex items-center justify-between border border-gray-300 px-3 py-1.5 rounded-xl bg-white shadow-sm hover:shadow transition-all mt-3">
                                            {/* Ícone + nome do arquivo */}
                                            <div className="flex items-center gap-2">
                                                <FileEdit className="w-5 h-5 text-blue-600" />
                                                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                            </div>

                                            {/* Ações */}
                                            <div className="flex items-center">

                                                {/* Visualizar */}
                                                <button
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5 text-gray-700" />
                                                </button>

                                                {/* Download */}
                                                <button
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                    title="Baixar"
                                                >
                                                    <Download className="w-5 h-5 text-gray-700" />
                                                </button>

                                                {/* Remover */}
                                                <button
                                                    onClick={() => removeArquivoDocumentos(index)}
                                                    className="p-2 rounded-lg hover:bg-red-100 transition"
                                                    title="Remover"
                                                >
                                                    <Trash className="w-5 h-5 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>}

                        {config.certificacoes.certificacoesFuncionario && <div className="basis-1/2">
                            <Card className="shadow-sm hover:shadow-md transition-shadow rounded-2xl border border-gray-200">
                                <CardHeader className="mb-[-10px]">
                                    <CardTitle className="flex gap-2 justify-between">
                                        <div className="flex gap-2">
                                            <Medal className="w-6 h-6 text-blue-600" />
                                            <span className="text-gray-800 font-bold text-sm md:text-lg">Certificações</span>
                                        </div>
                                        <Dialog open={certificacaoOpen} onOpenChange={setCertificacaoOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="h-8 mt-[-4px] transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 hover:scale-105 focus:outline-none">Inserir Certificações</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Inserir Certificações</DialogTitle>
                                                </DialogHeader>
                                                <div className="border border-gray-300 rounded-[5px] p-3 w-full bg-gradient-to-b from-white to-gray-50 shadow-sm hover:shadow-md transition-all">
                                                
                                                    <p className="font-semibold text-gray-700 mb-2 ml-1">Certificações Funcionário</p>
                        
                                                    {/* Área de arrastar e soltar */}
                                                    <div
                                                        className="flex flex-col items-center justify-center h-[230px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-300 ease-in-out bg-[#fafafa]"
                                                        onClick={() => document.getElementById("fileInputCertificacoes").click()}
                                                    >
                                                    <Upload className="h-10 w-10 text-gray-400 mb-2 transition-colors" />
                                                    <span className="text-gray-500 font-medium">Clique Para Selecionar O Arquivo</span>
                                                    <span className="text-sm text-gray-400">Selecione O Arquivo</span>
                                                    </div>
                        
                                                    {/* Input escondido */}
                                                    <input
                                                    id="fileInputCertificacoes"
                                                    type="file"
                                                    accept="image/png"
                                                    className="hidden"
                                                    multiple
                                                    onChange={handleFileChangeCertificacoes}
                                                    />
                        
                                                    {/* Lista de arquivos */}
                                                    <div className=" gap-3 mt-4 space-y-2 max-h-[225px] overflow-auto">
                                                    {arquivosCertificao.map((file, index) => (
                                                        <div className="flex items-center justify-between border border-gray-300 px-3 py-1.5 rounded-xl bg-white shadow-sm hover:shadow transition-all ">
                                                            {/* Ícone + nome do arquivo */}
                                                            <div className="flex items-center gap-2">
                                                                <FileEdit className="w-5 h-5 text-blue-600" />
                                                                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                                            </div>

                                                            {/* Ações */}
                                                            <div className="flex items-center">

                                                                {/* Visualizar */}
                                                                <button
                                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                                    title="Visualizar"
                                                                >
                                                                    <Eye className="w-5 h-5 text-gray-700" />
                                                                </button>

                                                                {/* Download */}
                                                                <button
                                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                                    title="Baixar"
                                                                >
                                                                    <Download className="w-5 h-5 text-gray-700" />
                                                                </button>

                                                                {/* Remover */}
                                                                <button
                                                                    onClick={() => removeArquivoDocumentos(index)}
                                                                    className="p-2 rounded-lg hover:bg-red-100 transition"
                                                                    title="Remover"
                                                                >
                                                                    <Trash className="w-5 h-5 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </CardTitle>
                                    <p className="text-gray-500 text-xs md:text-sm pl-8">Informe As Certificações Do Funcionário</p>
                                </CardHeader>
                                <CardContent>
                                    {arquivosCertificao.length === 0 && <p className="text-center text-gray-600 text-sm mt-5">Nenhuma Certificação Encontrada</p>}
                                    {arquivosCertificao.map((file, index) => (

                                        <div className="flex items-center justify-between border border-gray-300 px-3 py-1.5 rounded-xl bg-white shadow-sm hover:shadow transition-all mt-3">
                                            {/* Ícone + nome do arquivo */}
                                            <div className="flex items-center gap-2">
                                                <Medal className="w-5 h-5 text-blue-600" />
                                                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                            </div>

                                            {/* Ações */}
                                            <div className="flex items-center">

                                                {/* Visualizar */}
                                                <button
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5 text-gray-700" />
                                                </button>

                                                {/* Download */}
                                                <button
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                    title="Baixar"
                                                >
                                                    <Download className="w-5 h-5 text-gray-700" />
                                                </button>

                                                {/* Remover */}
                                                <button
                                                    onClick={() => removeArquivoCertificacoes(index)}
                                                    className="p-2 rounded-lg hover:bg-red-100 transition"
                                                    title="Remover"
                                                >
                                                    <Trash className="w-5 h-5 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>}

                    </div>
                </Card>
            </form>
        </div>


    );

} 

export default Novo_Funcionario;