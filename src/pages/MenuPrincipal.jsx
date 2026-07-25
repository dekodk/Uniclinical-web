import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Clientes from "./crud/Clientes";
import Colaboradores from "./crud/Coladoradores";
import Insumos from "./crud/Insumos";
import Procedimentos from "./crud/Procedimentos";
import Agendamento from "./crud/Agendamento";
import Agenda from "./crud/Agenda";
import Rel1Cliente from "./relatorios/rel1cliente";
import Rel1Colaboradores from "./relatorios/rel1colaboradores";
import Rel1Insumos from "./relatorios/rel1insumos";
import Rel1Procedimentos from "./relatorios/rel1procedimentos";
import Rel1Aniversariantes from "./relatorios/rel1aniversariantes";

export default function MenuPrincipal({ onLogout, usuarioLogado }) {
  const [telaAtiva, setTelaAtiva] = useState("home");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

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
      return <Agenda onEditAgendamento={handleEditarAgendamento} />;
    }

    if (telaAtiva === "agendamento") {
      return (
        <Agendamento
          agendamentoSelecionado={agendamentoSelecionado}
          onSaveComplete={() => setAgendamentoSelecionado(null)}
        />
      );
    }

    if (telaAtiva === "clientes") {
      return <Clientes />;
    }

    if (telaAtiva === "colaboradores") {
      return <Colaboradores />;
    }

    if (telaAtiva === "insumos") {
      return <Insumos />;
    }

    if (telaAtiva === "procedimentos") {
      return <Procedimentos />;
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

    return <h1>Bem-vindo ao sistema da clínica</h1>;
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
        <p>
          <p className="usuario-logado">
            Olá {usuarioLogado?.sub}, data de hoje: {new Date().toLocaleDateString("pt-BR")}.
          </p>
        </p>

        {renderizarConteudo()}
      </main>
    </div>
  );
}