import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Clientes from "./Clientes";
import Colaboradores from "./Coladoradores";
import Insumos from "./Insumos";
import Procedimentos from "./Procedimentos";
import Agendamento from "./Agendamento";
import Agenda from "./Agenda";


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