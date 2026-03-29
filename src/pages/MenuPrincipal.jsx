import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Procedimentos from "./Procedimentos";
import Insumos from "./Insumos";
import Colaboradores from"./Coladoradores";
import Clientes from "./Clientes";

export default function MenuPrincipal() {
  const [telaAtiva, setTelaAtiva] = useState("home");

  function renderizarConteudo() {

    if (telaAtiva === "clientes") {
      return <Clientes />;
    }
    
    if (telaAtiva === "colaboradores") {
      return <Procedimentos />;
    }

    if (telaAtiva === "insumos") {
      return <Insumos />;
    }

    if (telaAtiva === "procedimentos") {
      return <Colaboradores />;
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