import { useEffect, useMemo, useState } from "react";
import { FaSave, FaSearch, FaSyncAlt } from "react-icons/fa";
import "../Cadastros.css";

const API_URL = "http://localhost:8080/contas-receber";

const CONTA_INICIAL = {
  idCar: "",
  idAgendamento: "",
  idCliente: "",
  valorBase: "",
  descontoAcrescimo: "",
  juros: "",
  valorFinal: "",
  dataPrevista: "",
  dataPagamento: "",
  formaPagamento: "",
  status: "",
  observacao: "",
  origem: "",
};

export default function ContaReceber({ onVoltar }) {
  const [contas, setContas] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState(CONTA_INICIAL);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarContas();
  }, []);

  const contasFiltradas = useMemo(() => {
    const texto = normalizarTexto(busca);

    if (!texto) {
      return contas;
    }

    return contas.filter((conta) =>
      [
        conta.idCar,
        conta.idAgendamento,
        conta.idCliente,
        conta.valorBase,
        conta.descontoAcrescimo,
        conta.juros,
        conta.valorFinal,
        conta.dataPrevista,
        conta.dataPagamento,
        conta.formaPagamento,
        conta.status,
        conta.observacao,
        conta.origem,
      ].some((valor) => normalizarTexto(valor).includes(texto))
    );
  }, [busca, contas]);

  async function listarContas() {
    const token = localStorage.getItem("token");

    setCarregando(true);
    setErro("");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel carregar as contas a receber.");
      }

      const data = await response.json();
      setContas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar contas a receber:", error);
      setErro("Erro ao carregar as contas a receber.");
      setContas([]);
    } finally {
      setCarregando(false);
    }
  }

  function selecionar(conta) {
    setContaSelecionada({
      idCar: conta.idCar ?? "",
      idAgendamento: conta.idAgendamento ?? "",
      idCliente: conta.idCliente ?? "",
      valorBase: conta.valorBase ?? "",
      descontoAcrescimo: conta.descontoAcrescimo ?? "",
      juros: conta.juros ?? "",
      valorFinal: conta.valorFinal ?? "",
      dataPrevista: conta.dataPrevista ?? "",
      dataPagamento: conta.dataPagamento ?? "",
      formaPagamento: conta.formaPagamento ?? "",
      status: conta.status ?? "",
      observacao: conta.observacao ?? "",
      origem: conta.origem ?? "",
    });
  }

  function limparSelecao() {
    setContaSelecionada(CONTA_INICIAL);
  }

  function dataHojeISO() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  function alterarStatus(status) {
    setContaSelecionada((prev) => ({
      ...prev,
      status,
      dataPagamento:
        status === "FECHADO" && !prev.dataPagamento
          ? dataHojeISO()
          : prev.dataPagamento,
    }));
  }

  async function salvarConta() {
    if (!contaSelecionada.idCar) {
      alert("Selecione uma conta a receber para salvar.");
      return;
    }

    const token = localStorage.getItem("token");
    const dataPagamento =
      contaSelecionada.status === "FECHADO"
        ? contaSelecionada.dataPagamento || dataHojeISO()
        : contaSelecionada.dataPagamento || null;

    setSalvando(true);
    setErro("");

    try {
      const response = await fetch(`${API_URL}/${contaSelecionada.idCar}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idAgendamento: contaSelecionada.idAgendamento || null,
          idCliente: contaSelecionada.idCliente || null,
          valorBase: contaSelecionada.valorBase || null,
          descontoAcrescimo: contaSelecionada.descontoAcrescimo || null,
          juros: contaSelecionada.juros || null,
          valorFinal: contaSelecionada.valorFinal || null,
          dataPrevista: contaSelecionada.dataPrevista || null,
          dataPagamento,
          formaPagamento: contaSelecionada.formaPagamento || null,
          status: contaSelecionada.status || null,
          observacao: contaSelecionada.observacao || null,
          origem: contaSelecionada.origem || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel salvar a conta a receber.");
      }

      const contaAtualizada = await response.json();

      setContas((prev) =>
        prev.map((conta) =>
          conta.idCar === contaAtualizada.idCar ? contaAtualizada : conta
        )
      );
      selecionar(contaAtualizada);
      alert("Conta a receber salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar conta a receber:", error);
      setErro("Erro ao salvar a conta a receber.");
    } finally {
      setSalvando(false);
    }
  }

  function normalizarTexto(valor) {
    return String(valor ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatarMoeda(valor) {
    if (valor === null || valor === undefined || valor === "") {
      return "-";
    }

    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatarData(data) {
    if (!data) {
      return "-";
    }

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Contas a Receber</h1>
        <button
          type="button"
          className="botao-acao"
          style={{ minWidth: "120px", width: "auto", height: "42px", fontSize: "14px" }}
          onClick={onVoltar}
        >
          VOLTAR
        </button>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card" style={{ maxWidth: "1100px" }}>
          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Codigo</label>
              <input type="text" value={contaSelecionada.idCar} readOnly />
            </div>

            <div className="form-grupo codigo">
              <label>Agendamento</label>
              <input type="text" value={contaSelecionada.idAgendamento} readOnly />
            </div>

            <div className="form-grupo codigo">
              <label>Cliente</label>
              <input type="text" value={contaSelecionada.idCliente} readOnly />
            </div>

            <div className="form-grupo valor">
              <label>Valor final</label>
              <input
                type="text"
                value={
                  contaSelecionada.valorFinal
                    ? formatarMoeda(contaSelecionada.valorFinal)
                    : ""
                }
                readOnly
              />
            </div>

            <div className="form-grupo valor">
              <label>Status</label>
              <select
                value={contaSelecionada.status}
                onChange={(e) => alterarStatus(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="ABERTO">ABERTO</option>
                <option value="FECHADO">FECHADO</option>
              </select>
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo valor">
              <label>Data prevista</label>
              <input type="text" value={formatarData(contaSelecionada.dataPrevista)} readOnly />
            </div>

            <div className="form-grupo valor">
              <label>Data pagamento</label>
              <input
                type="date"
                value={contaSelecionada.dataPagamento}
                onChange={(e) =>
                  setContaSelecionada((prev) => ({
                    ...prev,
                    dataPagamento: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-grupo valor">
              <label>Forma pagamento</label>
              <select
                value={contaSelecionada.formaPagamento}
                onChange={(e) =>
                  setContaSelecionada((prev) => ({
                    ...prev,
                    formaPagamento: e.target.value,
                  }))
                }
              >
                <option value="">Selecione</option>
                <option value="DINHEIRO">DINHEIRO</option>
                <option value="CARTAO_CREDITO">CARTAO DE CREDITO</option>
                <option value="CARTAO_DEBITO">CARTAO DE DEBITO</option>
                <option value="PIX">PIX</option>
              </select>
            </div>

            <div className="form-grupo valor">
              <label>Origem</label>
              <input type="text" value={contaSelecionada.origem} readOnly />
            </div>
          </div>

          <div className="form-linha" style={{ alignItems: "flex-end", marginTop: "10px" }}>
            <div className="form-grupo nome" style={{ width: "520px" }}>
              <label>Buscar conta</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Codigo, cliente, agendamento, status, data, valor..."
                  style={{ flex: 1, minWidth: 0 }}
                />
                <button className="botao-icone-busca" title="Buscar">
                  <FaSearch />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "15px" }}>
              <button
                className="botao-acao"
                title="Salvar"
                onClick={salvarConta}
                disabled={salvando}
              >
                <FaSave />
              </button>

              <button className="botao-acao" title="Recarregar" onClick={listarContas}>
                <FaSyncAlt />
              </button>

              <button
                className="botao-selecionar-modal"
                type="button"
                onClick={limparSelecao}
                style={{ height: "42px" }}
              >
                Limpar
              </button>
            </div>
          </div>

          {erro && <p style={{ color: "#b91c1c", marginTop: 0 }}>{erro}</p>}

          <div style={{ marginTop: "20px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Codigo</th>
                  <th style={th}>Agendamento</th>
                  <th style={th}>Cliente</th>
                  <th style={th}>Valor final</th>
                  <th style={th}>Prevista</th>
                  <th style={th}>Pagamento</th>
                  <th style={th}>Forma</th>
                  <th style={th}>Status</th>
                  <th style={th}>Origem</th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td style={tdMensagem} colSpan="9">
                      Carregando contas...
                    </td>
                  </tr>
                ) : contasFiltradas.length === 0 ? (
                  <tr>
                    <td style={tdMensagem} colSpan="9">
                      Nenhuma conta encontrada.
                    </td>
                  </tr>
                ) : (
                  contasFiltradas.map((conta) => (
                    <tr
                      key={conta.idCar}
                      onClick={() => selecionar(conta)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          conta.idCar === contaSelecionada.idCar ? "#fff7ec" : "",
                      }}
                    >
                      <td style={td}>{conta.idCar}</td>
                      <td style={td}>{conta.idAgendamento ?? "-"}</td>
                      <td style={td}>{conta.idCliente ?? "-"}</td>
                      <td style={td}>{formatarMoeda(conta.valorFinal)}</td>
                      <td style={td}>{formatarData(conta.dataPrevista)}</td>
                      <td style={td}>{formatarData(conta.dataPagamento)}</td>
                      <td style={td}>{conta.formaPagamento || "-"}</td>
                      <td style={td}>{conta.status || "-"}</td>
                      <td style={td}>{conta.origem || "-"}</td>
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

const th = {
  textAlign: "left",
  padding: "12px 10px",
  borderBottom: "1px solid #e5e5e5",
  color: "#444",
};

const td = {
  padding: "12px 10px",
  borderBottom: "1px solid #eeeeee",
};

const tdMensagem = {
  ...td,
  textAlign: "center",
  color: "#666",
};
