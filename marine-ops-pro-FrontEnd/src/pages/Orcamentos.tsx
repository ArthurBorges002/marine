import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel} from '@/components/ui/alert-dialog';
import { FileText, Plus, Search, Download, Edit, Trash2, User,MapPin,DollarSign,Info, Calendar} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Calendario } from "@/components/ui/calendar";

const Orcamentos: React.FC = () => {

  const navegate = useNavigate();


  const [orcamentos, setOrcamentos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  /*===============================
    Variáveis de Estado FILTROS
  =================================*/
  const [searchTerm, setSearchTerm] = useState("");
  const [statusOrc, setStatusOrc] = useState("T");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");


  /*=====================================
          Status Do Orçamento
  =======================================*/
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'A': return 'bg-success text-success-foreground';
      case 'R': return 'bg-destructive text-destructive-foreground';
      case 'E': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'A': return 'Aprovado';
      case 'R': return 'Rejeitado';
      case 'E': return 'Em Análise';
      default: return status;
    }
  };


  /*=====================================
   Pegando os Orçamento na base de dados
  =======================================*/
  function fetchOrcamentos(page,search = "",status,dataInicial, dataFinal){

    setLoading(true);

    fetch(`http://localhost/marine-ops-BackEnd/orcamento/orcamento.php?page=${page}&search=${encodeURIComponent(search)}&status=${status}&data_inicial=${dataInicial}&data_final=${dataFinal}`)
    .then(res => res.json())
    .then(data => {
        
      if(page === 1){
        // Se for primeira página, reseta a lista
        setOrcamentos(data.data);
      }else{
        // Caso contrário, adiciona mais itens
        setOrcamentos((prev) => [...prev, ... data.data]);
      }

      setLoading(false);
      setHasMore(data.hasMore);

    });

  }

    // Quando a página muda (scroll infinito)
    useEffect(() => {

        fetchOrcamentos(page, searchTerm, statusOrc, dataInicial, dataFinal);

    }, [page]);


    // Quando o filtro muda, resetar a página e recarregar
    useEffect(() => {

      const delay = setTimeout(() => {
        setPage(1);
        fetchOrcamentos(1, searchTerm, statusOrc, dataInicial, dataFinal);

      }, 500); // debounce 500ms

      return () => clearTimeout(delay);


    }, [searchTerm, statusOrc, dataInicial, dataFinal]);


    // Detectar scroll no final da página
    useEffect(() => {
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.offsetHeight
        ) {
          if (hasMore && !loading) {
            setPage((prev) => prev + 1);
          }
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);


  // Usuario clicou para mudar o status
  function mudarStatus(status:string, codigo_orc: string){

    const novoStatus = status;
    const codigoOrcamento = codigo_orc;

      // Fazendo a requisição ao servidor para salvar na base, e mandando, no corpo da requisição, novo_status e o codigo do orçamento que mudou.
      fetch("http://localhost/marine-ops-BackEnd/orcamento/mudar_status_orcamento.php", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                novoStatus: novoStatus,
                codigoOrcamento: codigoOrcamento
            })
        })
        .then(res => res.json())
        .then(msg => {
            if(msg.status == "Certo"){

                setOrcamentos((prev) =>
                  prev.map((orc) =>
                    orc.codigo === codigo_orc ? { ...orc, status } : orc
                  )
                );

            }else if(msg.status == "Erro"){
              alert("Erro: " + msg.erro);
            }
        });
    }

    // Usuario clicou em Editar
    function editarOrcamento(codigo:string,codigo_interno:string){

      setTimeout(() => {
            scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);

      navegate(`/novo_orcamento?acao=editar&codigo=${codigo}&codigo_interno=${codigo_interno}`);

    }

    // Usuário confirmou exclusão
    function confirmarExclusao(codigo:string){
      
      fetch(`http://localhost/marine-ops-BackEnd/orcamento/excluir_orcamento.php?codigo="${codigo}"`)
      .then(res => res.json())
      .then(msg => {
        if(msg.status == "Certo"){
          setOrcamentos(prev => prev.filter(o => o.codigo !== codigo));
        }
      })
      .catch(err => console.error("Erro ao excluir Orçamento:", err));

    }


    // Usuario clicou em PDF
    function abrirPdfOrcamento(codigo:string){

      // Pegando as infomações para gerar o pdf
      fetch(`http://localhost/marine-ops-BackEnd/orcamento/infos_gerar_pdf.php?codigo=${codigo}`)
      .then(res => res.json())
      .then(data => {
        // Depois de pegar os dados, gerar o PDF
        return fetch(`http://localhost/marine-ops-BackEnd/orcamento/gerar_pdf.php?tipo=documento`, {
          method : "POST",
          headers : {
            "Content-Type": "application/json"
          },
          body : JSON.stringify({
            capa : data.capa,
            cabecalho : data.cabecalho,
            corpo : data.corpo,
            rodape : data.rodape,
            template_doc_pdf : data.template_selecionado_documento,
            marca_d_agua_doc : data.marcaDAgua_documento,
            template_capa_pdf : data.template_selecionado_capa,
            marca_d_agua_capa : data.marcaDAgua_capa
          })
        })
      })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank")
      })
      .catch(err => {
        console.error(err);
        alert("Ocorreu um erro ao gerar o PDF!! ");
      });

    }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
          <p className="text-muted-foreground">Gerencie propostas e orçamentos para clientes</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
          <Button onClick={() => navegate("/novo_orcamento?acao=criar")} className="bg-gradient-ocean border-0 shadow-glow">
            <Plus className="w-4 h-4 mr-2"/>
            Novo Orçamento
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex md:items-center flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por cliente, número ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusOrc} onValueChange={setStatusOrc} >
                <SelectTrigger className="w-full md:w-[110px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T">Status</SelectItem>
                    <SelectItem value="A">Aprovado</SelectItem>
                    <SelectItem value="E">Análise</SelectItem>
                    <SelectItem value="R">Rejeitado</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex w-full gap-2 mt-5">
              <div className="flex flex-wrap items-center justify-center gap-2 border border-gray-200 rounded-md px-3 py-[8px] bg-background">
                <p className="text-sm font-medium text-gray-600">Periodo De Busca: </p>
                <Input 
                  type="date" 
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="text-sm text-gray-700 border border-gray-300 rounded-[5px] px-4 py-[3px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full md:w-[30%] h-10 md:h-8"
                />
                <span className="hidden md:block text-sm font-medium text-gray-600">Até</span>
                <Input 
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)} 
                  className="text-sm text-gray-700 border border-gray-300 rounded-[5px] px-4 py-[3px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full md:w-[30%] h-10 md:h-8"
                />
              </div>
            </div>
        </CardContent>
      </Card>

      {orcamentos && orcamentos.length == 0 && 
      <p className='text-sm text-muted-foreground text-center' style={{marginBottom: "0px" }}>Nenhum Orçamento Foi Encontrado</p>
      }

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Orçamentos</p>
                <p className="text-2xl font-bold">{orcamentos.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  R$ {orcamentos.reduce((acc, orc) => acc + Number(orc.valor_total), 0).toLocaleString('pt-BR')}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Aprovação</p>
                <p className="text-2xl font-bold">
                  {Math.round((orcamentos.filter(o => o.status === 'A').length / orcamentos.length) * 100)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Orçamentos */}
      <div className="grid gap-4" 
      style=
      {{
        marginTop : orcamentos.length == 0 ? "0px" : "24px"
      }}
      >
        {orcamentos.map((orcamento) => (
          <Card key={orcamento.codigo} className="shadow-card hover:shadow-ocean transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Informações principais */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {orcamento.codigo_interno}
                      </h3>
                      <Badge className={getStatusColor(orcamento.status)}>
                        {getStatusLabel(orcamento.status)}
                      </Badge>
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium">{orcamento.nome_cliente}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Local:</span>
                      <span className="font-medium">{orcamento.cidade}/{orcamento.estado}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Data:</span>
                      <span className="font-medium">
                        {orcamento.criado_em_data}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-bold text-primary">
                        R$ {orcamento.valor_total}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Descrição:</span>
                    <p className="mt-1 text-foreground text-sm">{orcamento.info_complementar}</p>
                  </div>

                  <Button size="sm" variant="outline" className="flex-1 lg:flex-none mr-2 font-bold text-xs" onClick={() => mudarStatus("A",orcamento.codigo)}>Aprovado</Button>
                  <Button size="sm" variant="outline" className="flex-1 lg:flex-none mr-2 font-bold text-xs" onClick={() => mudarStatus("E",orcamento.codigo)}>Em ánalise</Button>
                  <Button size="sm" variant="outline" className="flex-1 lg:flex-none font-bold text-xs" onClick={() => mudarStatus("R", orcamento.codigo)}>Rejeitado</Button>
                  
                </div>

                {/* Ações */}
                <div className="flex flex-row lg:flex-col gap-2">
                  <Button size="sm" variant="outline" className="flex-1 lg:flex-none" onClick={() => abrirPdfOrcamento(orcamento.codigo)}>
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>

                  <Button size="sm" variant="outline" className="flex-1 lg:flex-none" 
                  onClick={() => {
                    editarOrcamento(orcamento.codigo,orcamento.codigo_interno);
                  }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>

                  <AlertDialog>
                    {/*Botão que abre o modal*/}
                    <AlertDialogTrigger>
                      <Button size="sm" variant="outline" className="flex-1 lg:flex-none text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    {/*Conteudo Do Modal*/}
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <div>
                          <Info className="w-12 h-12 text-blue-600"/>
                        </div>

                        <AlertDialogTitle>
                          {orcamento.codigo_interno}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este orçamento?
                        </AlertDialogDescription>  
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                          <Button size="sm" className='p-3' onClick={() => confirmarExclusao(orcamento.codigo)}>Excluir</Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                    
                  </AlertDialog>

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orcamentos;