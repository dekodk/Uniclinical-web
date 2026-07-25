import { useEffect, useState } from "react";
import "../Cadastros.css";

export default function Rel1Insumos({ onVoltar }) {
  const [insumos, setInsumos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [imprimindo, setImprimindo] = useState(false);

  useEffect(() => {
    async function carregarInsumos() {
      try {
        const token = localStorage.getItem("token")?.trim();
        if (!token) {
          throw new Error("Token não encontrado. Faça login novamente.");
        }

        const response = await fetch("http://localhost:8080/insumos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar insumos: ${response.status}`);
        }

        const data = await response.json();
        const insumosOrdenados = data.sort((a, b) =>
          a.nomeInsumo?.localeCompare(b.nomeInsumo, "pt-BR", { sensitivity: "base" })
        );

        setInsumos(insumosOrdenados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarInsumos();
  }, []);

  async function imprimirRelatorio() {
    const token = localStorage.getItem("token")?.trim();
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    setImprimindo(true);
    try {
      const response = await fetch(`http://localhost:8080/relatorios/insumos/pdf?token=${encodeURIComponent(token)}`, {
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
        <h1>Relatório de Insumos</h1>
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
            <p>Carregando insumos...</p>
          ) : erro ? (
            <p style={{ color: "#d9534f" }}>Erro: {erro}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={headerCell}>Código</th>
                    <th style={headerCell}>Nome</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.length === 0 ? (
                    <tr>
                      <td colSpan="2" style={{ padding: "18px 12px", textAlign: "center" }}>
                        Nenhum insumo encontrado.
                      </td>
                    </tr>
                  ) : (
                    insumos.map((insumo) => (
                      <tr key={insumo.idInsumo} style={{ backgroundColor: "#fff" }}>
                        <td style={bodyCell}>{insumo.idInsumo}</td>
                        <td style={bodyCell}>{insumo.nomeInsumo}</td>
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
