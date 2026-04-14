import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Clientes from "./Clientes";
import Colaboradores from"./Coladoradores";
import Insumos from "./Insumos";
import Procedimentos from "./Procedimentos";
import Agendamento from "./Agendamento";
import Agenda from "./Agenda";

export default function MenuPrincipal() {
  const [telaAtiva, setTelaAtiva] = useState("home");

  function renderizarConteudo() {

    if (telaAtiva === "agenda") {
      return <Agenda />;
    }

    if (telaAtiva === "agendamento") {
      return <Agendamento />;
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
      <Sidebar setTelaAtiva={setTelaAtiva} />

      <main
        style={{
          flex: 1,
          padding: "40px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {renderizarConteudo()}
      </main>
    </div>
  );
}