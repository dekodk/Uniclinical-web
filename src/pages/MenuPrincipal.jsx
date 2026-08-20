import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Clientes from "./crud/Clientes";
import Colaboradores from "./crud/Coladoradores";
import Insumos from "./crud/Insumos";
import Procedimentos from "./crud/Procedimentos";
import Agendamento from "./crud/Agendamento";
import Agenda from "./crud/Agenda";
import ContaPagar from "./crud/ContaPagar";
import ContaReceber from "./crud/ContaReceber";
import Rel1Cliente from "./relatorios/rel1cliente";
import Rel1Colaboradores from "./relatorios/rel1colaboradores";
import Rel1Insumos from "./relatorios/rel1insumos";
import Rel1Procedimentos from "./relatorios/rel1procedimentos";
import Rel1Aniversariantes from "./relatorios/rel1aniversariantes";
import Rel1ContasReceber from "./relatorios/rel1contasreceber";
import Rel1ContasPagar from "./relatorios/rel1contaspagar";
import Rel1Caixa from "./relatorios/rel1caixa";

export default function MenuPrincipal({ onLogout, usuarioLogado }) {
  const [telaAtiva, setTelaAtiva] = useState("home");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [carregandoAniversarios, setCarregandoAniversarios] = useState(false);
  const [erroAniversarios, setErroAniversarios] = useState("");

  useEffect(() => {
    if (telaAtiva !== "home") {
      return;
    }

    async function carregarClientes() {
      const token = localStorage.getItem("token");

      setCarregandoAniversarios(true);
      setErroAniversarios("");

      try {
        const response = await fetch("http://localhost:8080/clientes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar os aniversariantes.");
        }

        const data = await response.json();
        setClientes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar aniversariantes:", error);
        setErroAniversarios("Nao foi possivel carregar os aniversariantes.");
        setClientes([]);
      } finally {
        setCarregandoAniversarios(false);
      }
    }

    carregarClientes();
  }, [telaAtiva]);

  const aniversariantes = useMemo(() => {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    return {
      hoje: filtrarAniversariantes(clientes, hoje),
      amanha: filtrarAniversariantes(clientes, amanha),
    };
  }, [clientes]);

  function navegarTela(tela) {
    if (tela === "agendamento") {
      setAgendamentoSelecionado(null);
    }
    setTelaAtiva(tela);
  }

  function handleEditarAgendamento(agendamento) {
    setAgendamentoSelecionado(agendamento);
    setTelaAtiva("agendamento");
  }

  function renderizarConteudo() {
    if (telaAtiva === "agenda") {
      return (
        <Agenda
          onEditAgendamento={handleEditarAgendamento}
          onVoltar={() => setTelaAtiva("home")}
        />
      );
    }

    if (telaAtiva === "agendamento") {
      return (
        <Agendamento
          agendamentoSelecionado={agendamentoSelecionado}
          onSaveComplete={() => setAgendamentoSelecionado(null)}
          onVoltar={() => setTelaAtiva("home")}
        />
      );
    }

    if (telaAtiva === "clientes") {
      return <Clientes onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "colaboradores") {
      return <Colaboradores onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "insumos") {
      return <Insumos onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "procedimentos") {
      return <Procedimentos onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "contas-a-pagar") {
      return <ContaPagar onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "contas-a-receber") {
      return <ContaReceber onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "relatorio-clientes") {
      return <Rel1Cliente onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "relatorio-colaboradores") {
      return <Rel1Colaboradores onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "relatorio-insumos") {
      return <Rel1Insumos onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "relatorio-procedimentos") {
      return <Rel1Procedimentos onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "relatorio-aniversariantes") {
      return <Rel1Aniversariantes onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "relatorio-contas-receber") {
      return <Rel1ContasReceber onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "relatorio-contas-pagar") {
      return <Rel1ContasPagar onVoltar={() => setTelaAtiva("home")} />;
    }

    if (telaAtiva === "relatorio-caixa") {
      return <Rel1Caixa onVoltar={() => setTelaAtiva("home")} />;
    }

    return (
      <div>
        <h1>Bem-vindo ao sistema da cl&iacute;nica</h1>
        <section style={estilosAniversarios.container}>
          <h2 style={estilosAniversarios.titulo}>Aniversariantes</h2>

          {carregandoAniversarios ? (
            <p style={estilosAniversarios.mensagem}>Carregando aniversariantes...</p>
          ) : erroAniversarios ? (
            <p style={estilosAniversarios.erro}>{erroAniversarios}</p>
          ) : (
            <div style={estilosAniversarios.grid}>
              <ListaAniversariantes titulo="Hoje" itens={aniversariantes.hoje} />
              <ListaAniversariantes titulo="Amanh&atilde;" itens={aniversariantes.amanha} />
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="menu-principal-layout">
      <Sidebar
        setTelaAtiva={navegarTela}
        onLogout={onLogout}
        usuarioLogado={usuarioLogado}
      />

      <main
        style={{
          flex: 1,
          padding: "40px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <p className="usuario-logado">
          Ol&aacute; {usuarioLogado?.sub}, data de hoje: {new Date().toLocaleDateString("pt-BR")}.
        </p>

        {renderizarConteudo()}
      </main>
    </div>
  );
}

function ListaAniversariantes({ titulo, itens }) {
  return (
    <div style={estilosAniversarios.card}>
      <h3 style={estilosAniversarios.subtitulo}>{titulo}</h3>

      {itens.length === 0 ? (
        <p style={estilosAniversarios.mensagem}>Sem aniversariantes</p>
      ) : (
        <ul style={estilosAniversarios.lista}>
          {itens.map((cliente) => (
            <li key={cliente.idCliente} style={estilosAniversarios.item}>
              <span style={estilosAniversarios.nome}>
                {cliente.idCliente} - {cliente.nomeCliente}
              </span>
              <span>{formatarData(cliente.dtnCliente)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function filtrarAniversariantes(clientes, dataReferencia) {
  return clientes
    .filter((cliente) => {
      const dataNascimento = parseDataLocal(cliente.dtnCliente);

      if (!dataNascimento) {
        return false;
      }

      return (
        dataNascimento.getDate() === dataReferencia.getDate() &&
        dataNascimento.getMonth() === dataReferencia.getMonth()
      );
    })
    .sort((a, b) =>
      a.nomeCliente?.localeCompare(b.nomeCliente, "pt-BR", { sensitivity: "base" })
    );
}

function parseDataLocal(data) {
  if (!data) {
    return null;
  }

  const [ano, mes, dia] = data.split("-").map(Number);

  if (!ano || !mes || !dia) {
    return null;
  }

  return new Date(ano, mes - 1, dia);
}

function formatarData(data) {
  const dataLocal = parseDataLocal(data);

  if (!dataLocal) {
    return "-";
  }

  return dataLocal.toLocaleDateString("pt-BR");
}

const estilosAniversarios = {
  container: {
    marginTop: "28px",
    maxWidth: "760px",
  },
  titulo: {
    fontSize: "22px",
    margin: "0 0 16px",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e6e6e6",
    borderRadius: "8px",
    padding: "18px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.04)",
  },
  subtitulo: {
    margin: "0 0 12px",
    fontSize: "18px",
    color: "#c97b1d",
  },
  lista: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "10px 0",
    borderBottom: "1px solid #eeeeee",
    color: "#333",
  },
  nome: {
    fontWeight: 600,
  },
  mensagem: {
    margin: 0,
    color: "#666",
  },
  erro: {
    margin: 0,
    color: "#b91c1c",
  },
};
