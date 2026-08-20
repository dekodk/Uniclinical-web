import { useEffect, useState } from "react";
import "../Cadastros.css";

export default function Rel1ContasPagar({ onVoltar }) {
  const [filtros, setFiltros] = useState({
    dataInicial: "",
    dataFinal: "",
    status: "ABERTO",
  });
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPreview() {
      if (!filtros.dataInicial || !filtros.dataFinal || filtros.dataInicial > filtros.dataFinal) {
        setContas([]);
        return;
      }

      const token = localStorage.getItem("token")?.trim();
      if (!token) {
        setContas([]);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const params = new URLSearchParams({
          dataInicial: filtros.dataInicial,
          dataFinal: filtros.dataFinal,
          status: filtros.status,
          token,
        });

        const response = await fetch(
          `http://localhost:8080/relatorios/contas-pagar?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const texto = await response.text();
          throw new Error(`Nao foi possivel carregar a previa (${response.status}): ${texto}`);
        }

        const data = await response.json();
        setContas(Array.isArray(data) ? data : []);
      } catch (error) {
        setErro(error.message);
        setContas([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarPreview();
  }, [filtros]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function imprimirRelatorio() {
    if (!filtros.dataInicial) {
      alert("Informe a data inicial.");
      return;
    }

    if (!filtros.dataFinal) {
      alert("Informe a data final.");
      return;
    }

    if (filtros.dataInicial > filtros.dataFinal) {
      alert("A data inicial nao pode ser maior que a data final.");
      return;
    }

    const token = localStorage.getItem("token")?.trim();
    if (!token) {
      alert("Token nao encontrado. Faca login novamente.");
      return;
    }

    setErro("");
    setImprimindo(true);

    try {
      const params = new URLSearchParams({
        dataInicial: filtros.dataInicial,
        dataFinal: filtros.dataFinal,
        status: filtros.status,
        token,
      });

      const response = await fetch(
        `http://localhost:8080/relatorios/contas-pagar/pdf?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const texto = await response.text();
        throw new Error(`Nao foi possivel gerar o relatorio (${response.status}): ${texto}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      setErro(error.message);
    } finally {
      setImprimindo(false);
    }
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Relat&oacute;rio de Contas a Pagar</h1>
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", alignItems: "flex-end", marginBottom: "24px" }}>
            <div className="form-grupo valor" style={{ marginBottom: 0 }}>
              <label>Data inicial</label>
              <input
                type="date"
                name="dataInicial"
                value={filtros.dataInicial}
                onChange={handleChange}
              />
            </div>

            <div className="form-grupo valor" style={{ marginBottom: 0 }}>
              <label>Data final</label>
              <input
                type="date"
                name="dataFinal"
                value={filtros.dataFinal}
                onChange={handleChange}
              />
            </div>

            <div className="form-grupo valor" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <select
                name="status"
                value={filtros.status}
                onChange={handleChange}
              >
                <option value="TODOS">TODOS</option>
                <option value="ABERTO">ABERTO</option>
                <option value="PAGO">PAGO</option>
                <option value="VENCIDO">VENCIDO</option>
              </select>
            </div>
          </div>

          <p style={{ color: "#555", marginTop: 0 }}>
            O relat&oacute;rio ser&aacute; gerado com as contas a pagar por data de vencimento e status selecionados.
          </p>

          {erro && <p style={{ color: "#d9534f" }}>Erro: {erro}</p>}

          <div style={{ overflowX: "auto", marginTop: "24px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={headerCell}>C&oacute;digo</th>
                  <th style={headerCell}>Fornecedor</th>
                  <th style={headerCell}>NF</th>
                  <th style={headerCell}>Vencimento</th>
                  <th style={headerCell}>Valor total</th>
                  <th style={headerCell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan="6" style={mensagemCell}>
                      Carregando contas a pagar...
                    </td>
                  </tr>
                ) : !filtros.dataInicial || !filtros.dataFinal ? (
                  <tr>
                    <td colSpan="6" style={mensagemCell}>
                      Informe a data inicial e a data final para visualizar a pr&eacute;via.
                    </td>
                  </tr>
                ) : contas.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={mensagemCell}>
                      Nenhuma conta a pagar encontrada para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  contas.map((conta) => (
                    <tr key={conta.idCap} style={{ backgroundColor: "#fff" }}>
                      <td style={bodyCell}>{conta.idCap}</td>
                      <td style={bodyCell}>{conta.fornecedor || "-"}</td>
                      <td style={bodyCell}>{conta.numeroNf || "-"}</td>
                      <td style={bodyCell}>{formatarData(conta.dataVencimento)}</td>
                      <td style={bodyCell}>{formatarMoeda(conta.valorTotal)}</td>
                      <td style={bodyCell}>{conta.situacao}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

const mensagemCell = {
  padding: "18px 12px",
  textAlign: "center",
  color: "#666",
};

function formatarData(valor) {
  if (!valor) return "";

  const data = String(valor).split("T")[0];
  const [ano, mes, dia] = data.split("-");

  if (!ano || !mes || !dia) {
    return valor;
  }

  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "";
  }

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
