import { useEffect, useState } from "react";
import "../Cadastros.css";

export default function Rel1Caixa({ onVoltar }) {
  const [filtros, setFiltros] = useState({
    dataInicial: "",
    dataFinal: "",
  });
  const [resumo, setResumo] = useState({
    entradas: 0,
    saidas: 0,
    saldo: 0,
  });
  const [movimentos, setMovimentos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarCaixa() {
      if (!filtros.dataInicial || !filtros.dataFinal || filtros.dataInicial > filtros.dataFinal) {
        setResumo({ entradas: 0, saidas: 0, saldo: 0 });
        setMovimentos([]);
        return;
      }

      const token = localStorage.getItem("token")?.trim();
      if (!token) {
        setResumo({ entradas: 0, saidas: 0, saldo: 0 });
        setMovimentos([]);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const params = new URLSearchParams({
          dataInicial: filtros.dataInicial,
          dataFinal: filtros.dataFinal,
          token,
        });

        const response = await fetch(
          `http://localhost:8080/relatorios/caixa?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const texto = await response.text();
          throw new Error(`Nao foi possivel carregar o caixa (${response.status}): ${texto}`);
        }

        const data = await response.json();

        setResumo({
          entradas: Number(data.entradas ?? 0),
          saidas: Number(data.saidas ?? 0),
          saldo: Number(data.saldo ?? 0),
        });
        setMovimentos(Array.isArray(data.movimentos) ? data.movimentos : []);
      } catch (error) {
        setErro(error.message);
        setResumo({ entradas: 0, saidas: 0, saldo: 0 });
        setMovimentos([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarCaixa();
  }, [filtros]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function imprimirRelatorio() {
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

    alert("PDF do relatorio de caixa ainda sera ligado quando o arquivo Jasper estiver disponivel.");
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Relat&oacute;rio de Caixa</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            className="botao-acao"
            style={{ minWidth: "120px", width: "auto", height: "42px", fontSize: "14px" }}
            onClick={onVoltar}
          >
            VOLTAR
          </button>
          
        </div>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card" style={{ padding: "24px", maxWidth: "1120px" }}>
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
          </div>

          <p style={{ color: "#555", marginTop: 0 }}>
            O caixa considerar&aacute; entradas de contas a receber com status FECHADO e sa&iacute;das de contas a pagar com situa&ccedil;&atilde;o PAGO, sempre pela data de pagamento.
          </p>

          {erro && <p style={{ color: "#d9534f" }}>Erro: {erro}</p>}

          <div style={resumoGrid}>
            <div style={resumoCard}>
              <span style={resumoLabel}>Entradas</span>
              <strong style={{ ...resumoValor, color: "#047857" }}>{formatarMoeda(resumo.entradas)}</strong>
            </div>

            <div style={resumoCard}>
              <span style={resumoLabel}>Sa&iacute;das</span>
              <strong style={{ ...resumoValor, color: "#b91c1c" }}>{formatarMoeda(resumo.saidas)}</strong>
            </div>

            <div style={resumoCard}>
              <span style={resumoLabel}>Saldo</span>
              <strong style={{ ...resumoValor, color: resumo.saldo < 0 ? "#b91c1c" : "#047857" }}>
                {formatarMoeda(resumo.saldo)}
              </strong>
            </div>
          </div>

          <div style={{ overflowX: "auto", marginTop: "24px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={headerCell}>Tipo</th>
                  <th style={headerCell}>Data pagamento</th>
                  <th style={headerCell}>Origem</th>
                  <th style={headerCell}>Descri&ccedil;&atilde;o</th>
                  <th style={headerCell}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan="5" style={mensagemCell}>
                      Carregando movimentos do caixa...
                    </td>
                  </tr>
                ) : !filtros.dataInicial || !filtros.dataFinal ? (
                  <tr>
                    <td colSpan="5" style={mensagemCell}>
                      Informe a data inicial e a data final para visualizar a pr&eacute;via.
                    </td>
                  </tr>
                ) : movimentos.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={mensagemCell}>
                      Nenhum movimento de caixa encontrado para o per&iacute;odo selecionado.
                    </td>
                  </tr>
                ) : (
                  movimentos.map((movimento, index) => (
                    <tr key={`${movimento.tipo}-${movimento.dataPagamento}-${index}`} style={{ backgroundColor: "#fff" }}>
                      <td style={bodyCell}>{movimento.tipo}</td>
                      <td style={bodyCell}>{formatarData(movimento.dataPagamento)}</td>
                      <td style={bodyCell}>{movimento.origem}</td>
                      <td style={bodyCell}>{movimento.descricao}</td>
                      <td
                        style={{
                          ...bodyCell,
                          color: movimento.tipo === "SAIDA" ? "#b91c1c" : "#047857",
                          fontWeight: 600,
                        }}
                      >
                        {formatarMoeda(movimento.valor)}
                      </td>
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

const resumoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginTop: "24px",
};

const resumoCard = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6e6e6",
  borderRadius: "8px",
  padding: "16px",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.04)",
};

const resumoLabel = {
  display: "block",
  color: "#555",
  fontSize: "14px",
  marginBottom: "8px",
};

const resumoValor = {
  display: "block",
  fontSize: "22px",
};

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
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
