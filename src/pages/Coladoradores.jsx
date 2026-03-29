import "./cadastros.css";
import { useState } from "react";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";

export default function Colaboradores() {

  const [nivel, setNivel] = useState("usuario");

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo">
        <h1>Cadastro de Colaboradores</h1>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card">

          {/* 🔹 LINHA 1 */}
          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Código</label>
              <input type="text" />
            </div>

            <div className="form-grupo nome">
              <label>Nome do colaborador</label>
              <input type="text" />
            </div>
          </div>

          {/* 🔹 LINHA 2 (isolada, sem mexer no CSS global) */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <label
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#444",
                  marginBottom: "8px",
                }}
              >
                Login
              </label>
              <input
                type="text"
                style={{
                  height: "42px",
                  padding: "0 12px",
                  border: "1px solid #d6d6d6",
                  borderRadius: "10px",
                  fontSize: "16px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
              }}
            >
              <label
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#444",
                  marginBottom: "8px",
                }}
              >
                Senha
              </label>
              <input
                type="password"
                style={{
                  height: "42px",
                  padding: "0 12px",
                  border: "1px solid #d6d6d6",
                  borderRadius: "10px",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "24px",
              alignItems: "center",
            }}
          >
            <label style={{ fontWeight: "600", color: "#444" }}>Nível:</label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="radio"
                name="nivel"
                value="usuario"
                checked={nivel === "usuario"}
                onChange={(e) => setNivel(e.target.value)}
              />
              Usuário
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="radio"
                name="nivel"
                value="admin"
                checked={nivel === "admin"}
                onChange={(e) => setNivel(e.target.value)}
              />
              Administrador
            </label>
          </div>

          {/* 🔹 BOTÕES */}
          <div className="barra-acoes">
            <button className="botao-acao" title="Novo">
              <FaPlus />
            </button>
            <button className="botao-acao" title="Salvar">
              <FaSave />
            </button>
            <button className="botao-acao botao-inativar" title="Inativar">
              <FaBan />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}