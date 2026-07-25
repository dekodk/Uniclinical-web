import { useEffect, useState } from "react";
import "../Cadastros.css";

export default function Rel1Colaboradores({ onVoltar }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [imprimindo, setImprimindo] = useState(false);

  useEffect(() => {
    async function carregarColaboradores() {
      try {
        const token = localStorage.getItem("token")?.trim();
        if (!token) {
          throw new Error("Token não encontrado. Faça login novamente.");
        }

        const response = await fetch("http://localhost:8080/colaboradores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar colaboradores: ${response.status}`);
        }

        const data = await response.json();
        setColaboradores(data);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarColaboradores();
  }, []);

  async function imprimirRelatorio() {
    const token = localStorage.getItem("token")?.trim();
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    setImprimindo(true);
    try {
      const response = await fetch(`http://localhost:8080/relatorios/colaboradores/pdf?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const texto = await response.text();
        throw new Error(`Não foi possível gerar o relatório (${response.status}): ${texto}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      alert(error.message);
    } finally {
      setImprimindo(false);
    }
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Relatório de Colaboradores</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            className="botao-acao"
            style={{ minWidth: "120px", width: "auto", height: "42px", fontSize: "14px" }}
            onClick={onVoltar}
          >
            VOLTAR
          </button>
          <button
            type="button"
            className="botao-acao"
            style={{ minWidth: "120px", width: "auto", height: "42px", fontSize: "14px" }}
            onClick={imprimirRelatorio}
            disabled={imprimindo}
          >
            {imprimindo ? "Gerando..." : "IMPRIMIR"}
          </button>
        </div>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card" style={{ padding: "24px" }}>
          {carregando ? (
            <p>Carregando colaboradores...</p>
          ) : erro ? (
            <p style={{ color: "#d9534f" }}>Erro: {erro}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={headerCell}>Código Usuário</th>
                    <th style={headerCell}>Nome</th>
                    <th style={headerCell}>Nível</th>
                  </tr>
                </thead>
                <tbody>
                  {colaboradores.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ padding: "18px 12px", textAlign: "center" }}>
                        Nenhum colaborador encontrado.
                      </td>
                    </tr>
                  ) : (
                    colaboradores.map((colaborador) => (
                      <tr key={colaborador.idUser} style={{ backgroundColor: "#fff" }}>
                        <td style={bodyCell}>{colaborador.idUser}</td>
                        <td style={bodyCell}>{colaborador.nomeUser}</td>
                        <td style={bodyCell}>{colaborador.nivel}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const headerCell = {
  textAlign: "left",
  padding: "14px 12px",
  borderBottom: "2px solid #e5e5e5",
  color: "#333",
  fontWeight: 600,
  backgroundColor: "#fafafa",
};

const bodyCell = {
  padding: "14px 12px",
  borderBottom: "1px solid #eee",
  color: "#444",
};
