import { useEffect, useState } from "react";
import "../Cadastros.css";

const meses = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export default function Rel1Aniversariantes({ onVoltar }) {
  const [mes, setMes] = useState(1);
  const [aniversariantes, setAniversariantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [imprimindo, setImprimindo] = useState(false);
  const [erro, setErro] = useState(null);

  async function carregarAniversariantes(mesSelecionado) {
    setCarregando(true);
    setErro(null);

    try {
      const token = localStorage.getItem("token")?.trim();
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      const response = await fetch(`http://localhost:8080/relatorios/aniversariantes?mes=${mesSelecionado}&token=${encodeURIComponent(token)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar aniversariantes: ${response.status}`);
      }

      const data = await response.json();
      setAniversariantes(data);
    } catch (error) {
      setErro(error.message);
      setAniversariantes([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAniversariantes(mes);
  }, [mes]);

  function formatarData(valor) {
    if (!valor) return "";

    const dataString = String(valor).split("T")[0];
    const [ano, mes, dia] = dataString.split("-");
    if (!dia || !mes || !ano) {
      return valor;
    }

    return `${dia}/${mes}/${ano}`;
  }

  async function imprimirRelatorio() {
    const token = localStorage.getItem("token")?.trim();
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    setErro(null);
    setImprimindo(true);

    try {
      const response = await fetch(`http://localhost:8080/relatorios/aniversariantes/pdf?mes=${mes}&token=${encodeURIComponent(token)}`, {
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
      setErro(error.message);
    } finally {
      setImprimindo(false);
    }
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Relatório de Aniversariantes</h1>
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
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <label htmlFor="mes" style={{ fontWeight: 600, color: "#333" }}>
              Selecione o mês:
            </label>
            <select
              id="mes"
              value={mes}
              onChange={(event) => setMes(Number(event.target.value))}
              style={{ padding: "10px 12px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "180px" }}
            >
              {meses.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          {erro && <p style={{ color: "#d9534f" }}>Erro: {erro}</p>}

          <p style={{ color: "#555" }}>
            O relatório será gerado com os aniversariantes do mês selecionado.
          </p>

          <div style={{ overflowX: "auto", marginTop: "24px" }}>
            {carregando ? (
              <p>Carregando aniversariantes...</p>
            ) : aniversariantes.length === 0 ? (
              <p>Nenhum aniversariante encontrado para este mês.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={headerCell}>Nome</th>
                    <th style={headerCell}>Aniversário</th>
                    <th style={headerCell}>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {aniversariantes.map((item) => (
                    <tr key={`${item.idCliente}-${item.dtnCliente}`} style={{ backgroundColor: "#fff" }}>
                      <td style={bodyCell}>{item.nomeCliente}</td>
                      <td style={bodyCell}>{formatarData(item.dtnCliente)}</td>
                      <td style={bodyCell}>{item.foneCliente || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
