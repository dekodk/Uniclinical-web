import { useState } from "react";
import "./Sidebar.css";
import logoClinica from "../assets/Saúde e estética_logo.jpg";

export default function Sidebar({ setTelaAtiva }) {
  const [recolhido, setRecolhido] = useState(false);
  const [menuAtivo, setMenuAtivo] = useState("");
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [agendarAberto, setAgendarAberto] = useState(false);

  function alternarSidebar() {
    setRecolhido(!recolhido);
  }

  function clicarMenu(nome) {
    setMenuAtivo(nome);

    if (nome === "Cadastrar") {
      setCadastroAberto(!cadastroAberto);
      setAgendarAberto(false);
    } else if (nome === "Agendar") {
      setAgendarAberto(!agendarAberto);
      setCadastroAberto(false);
    } else {
      setCadastroAberto(false);
      setAgendarAberto(false);
      setTelaAtiva(nome.toLowerCase());
    }
  }

  return (
    <aside className={`sidebar ${recolhido ? "recolhida" : ""}`}>
      <div className="sidebar-topo">
        <button className="botao-recolher" onClick={alternarSidebar}>
          {recolhido ? "➡" : "⬅"}
        </button>

        {!recolhido && (
          <img
            src={logoClinica}
            alt="Logo da clínica"
            className="logo-sidebar"
          />
        )}
      </div>

      <nav className="menu-nav">
        <button
          className={`menu-item ${menuAtivo === "Agendar" ? "ativo" : ""}`}
          onClick={() => clicarMenu("Agendar")}
        >
          <span className="menu-icone">📅</span>

          {!recolhido && (
            <>
              <span className="menu-texto">Agendar</span>
              <span className="seta-submenu">
                {agendarAberto ? "▲" : "▼"}
              </span>
            </>
          )}
        </button>
        
        {!recolhido && agendarAberto && (
          <div className="submenu">
            <button
              className="submenu-item"
              onClick={() => setTelaAtiva("agendamento")}
            >
              Agendamento
            </button>

            <button
              className="submenu-item"
              onClick={() => setTelaAtiva("agenda")}
            >
              Agenda do Dia
            </button>
          </div>
        )}

        <button
          className={`menu-item ${menuAtivo === "Cadastrar" ? "ativo" : ""}`}
          onClick={() => clicarMenu("Cadastrar")}
        >
          <span className="menu-icone">👤</span>

          {!recolhido && (
            <>
              <span className="menu-texto">Cadastrar</span>
              <span className="seta-submenu">
                {cadastroAberto ? "▲" : "▼"}
              </span>
            </>
          )}
        </button>

        {!recolhido && cadastroAberto && (
          <div className="submenu">

            <button
              className="submenu-item"
              onClick={() => setTelaAtiva("clientes")}
            >
              Clientes
            </button>

            <button
              className="submenu-item"
              onClick={() => setTelaAtiva("colaboradores")}
            >
              Colaboradores
            </button>

            <button
              className="submenu-item"
              onClick={() => setTelaAtiva("insumos")}
            >
              Insumos
            </button>

            <button
              className="submenu-item"
              onClick={() => setTelaAtiva("procedimentos")}
            >
              Procedimentos
            </button>
          </div>
        )}

        <button
          className={`menu-item ${menuAtivo === "Financeiro" ? "ativo" : ""}`}
          onClick={() => clicarMenu("Financeiro")}
        >
          <span className="menu-icone">💰</span>
          {!recolhido && <span className="menu-texto">Financeiro</span>}
        </button>

        <button
          className={`menu-item ${menuAtivo === "Relatórios" ? "ativo" : ""}`}
          onClick={() => clicarMenu("Relatórios")}
        >
          <span className="menu-icone">📊</span>
          {!recolhido && <span className="menu-texto">Relatórios</span>}
        </button>

        <button
          className={`menu-item ${menuAtivo === "Sair" ? "ativo" : ""}`}
          onClick={() => clicarMenu("Sair")}
        >
          <span className="menu-icone">🚪</span>
          {!recolhido && <span className="menu-texto">Sair</span>}
        </button>
      </nav>
    </aside>
  );
}