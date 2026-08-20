import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSave, FaSearch, FaSyncAlt } from "react-icons/fa";
import "../Cadastros.css";

const API_URL = "http://localhost:8080/contas-pagar";

const FORMULARIO_INICIAL = {
  idCap: "",
  situacao: "ABERTO",
  fornecedor: "",
  serie: "",
  numeroNf: "",
  chaveNf: "",
  valor: "",
  juros: "",
  valorTotal: "",
  dataEmissao: "",
  dataLancamento: "",
  dataVencimento: "",
  dataPagamento: "",
  observacao: "",
};

export default function ContaPagar({ onVoltar }) {
  const [form, setForm] = useState({ ...FORMULARIO_INICIAL });
  const [contas, setContas] = useState([]);
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
        conta.idCap,
        conta.situacao,
        conta.fornecedor,
        conta.serie,
        conta.numeroNf,
        conta.chaveNf,
        conta.valor,
        conta.juros,
        conta.valorTotal,
        conta.dataEmissao,
        conta.dataLancamento,
        conta.dataVencimento,
        conta.dataPagamento,
        conta.observacao,
      ].some((valor) => normalizarTexto(valor).includes(texto))
    );
  }, [busca, contas]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => {
      const proximo = {
        ...prev,
        [name]: value,
      };

      if (name === "valor" || name === "juros") {
        proximo.valorTotal = calcularValorTotal(proximo.valor, proximo.juros);
      }

      return proximo;
    });
  }

  function handleValorChange(event) {
    const { name, value } = event.target;
    const valorFormatado = formatarValorDigitacao(value);

    setForm((prev) => {
      const proximo = {
        ...prev,
        [name]: valorFormatado,
      };

      proximo.valorTotal = calcularValorTotal(proximo.valor, proximo.juros);
      return proximo;
    });
  }

  function handleNovo() {
    setForm({ ...FORMULARIO_INICIAL });
    setErro("");
  }

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
        throw new Error("Nao foi possivel carregar as contas a pagar.");
      }

      const data = await response.json();
      setContas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar contas a pagar:", error);
      setErro("Erro ao carregar as contas a pagar.");
      setContas([]);
    } finally {
      setCarregando(false);
    }
  }

  async function handleSalvar() {
    const token = localStorage.getItem("token");

    if (!form.fornecedor.trim()) {
      alert("Informe o fornecedor.");
      return;
    }

    setSalvando(true);
    setErro("");

    const isEdicao = Boolean(form.idCap);
    const url = isEdicao ? `${API_URL}/${form.idCap}` : API_URL;

    try {
      const response = await fetch(url, {
        method: isEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          situacao: form.situacao || null,
          fornecedor: form.fornecedor.trim() || null,
          serie: form.serie.trim() || null,
          numeroNf: form.numeroNf.trim() || null,
          chaveNf: form.chaveNf.trim() || null,
          valor: converterValorBRParaNumero(form.valor),
          juros: converterValorBRParaNumero(form.juros),
          valorTotal: converterValorBRParaNumero(form.valorTotal),
          dataEmissao: form.dataEmissao || null,
          dataLancamento: form.dataLancamento || null,
          dataVencimento: form.dataVencimento || null,
          dataPagamento: form.dataPagamento || null,
          observacao: form.observacao.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel salvar a conta a pagar.");
      }

      await listarContas();
      handleNovo();
      alert(isEdicao ? "Conta a pagar atualizada com sucesso!" : "Conta a pagar salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar conta a pagar:", error);
      setErro("Erro ao salvar a conta a pagar.");
    } finally {
      setSalvando(false);
    }
  }

  function selecionar(conta) {
    setForm({
      idCap: conta.idCap ?? "",
      situacao: conta.situacao ?? "ABERTO",
      fornecedor: conta.fornecedor ?? "",
      serie: conta.serie ?? "",
      numeroNf: conta.numeroNf ?? "",
      chaveNf: conta.chaveNf ?? "",
      valor: formatarMoeda(conta.valor),
      juros: formatarMoeda(conta.juros),
      valorTotal: formatarMoeda(conta.valorTotal),
      dataEmissao: conta.dataEmissao ?? "",
      dataLancamento: conta.dataLancamento ?? "",
      dataVencimento: conta.dataVencimento ?? "",
      dataPagamento: conta.dataPagamento ?? "",
      observacao: conta.observacao ?? "",
    });
  }

  function calcularValorTotal(valor, juros) {
    const total = converterValorBRParaNumero(valor) + converterValorBRParaNumero(juros);
    return formatarMoeda(total);
  }

  function converterValorBRParaNumero(valor) {
    if (valor === null || valor === undefined || valor === "") {
      return 0;
    }

    return Number(String(valor).replace(/\./g, "").replace(",", ".")) || 0;
  }

  function formatarValorDigitacao(valorDigitado) {
    const somenteNumeros = valorDigitado.replace(/\D/g, "");

    if (!somenteNumeros) {
      return "";
    }

    const numero = Number(somenteNumeros) / 100;
    return formatarMoeda(numero);
  }

  function formatarMoeda(valor) {
    if (valor === null || valor === undefined || valor === "") {
      return "";
    }

    return Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatarData(data) {
    if (!data) {
      return "-";
    }

    const [ano, mes, dia] = String(data).split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function normalizarTexto(valor) {
    return String(valor ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Contas a Pagar</h1>
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
        <div className="cadastros-card" style={{ maxWidth: "1120px" }}>
          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Codigo</label>
              <input type="text" name="idCap" value={form.idCap} readOnly />
            </div>

            <div className="form-grupo valor">
              <label>Situacao</label>
              <select name="situacao" value={form.situacao} onChange={handleChange}>
                <option value="ABERTO">ABERTO</option>
                <option value="PAGO">PAGO</option>
                <option value="VENCIDO">VENCIDO</option>
              </select>
            </div>

            <div className="form-grupo nome" style={{ width: "520px" }}>
              <label>Fornecedor</label>
              <input
                type="text"
                name="fornecedor"
                value={form.fornecedor}
                onChange={handleChange}
                maxLength="250"
              />
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Serie</label>
              <input type="text" name="serie" value={form.serie} onChange={handleChange} maxLength="45" />
            </div>

            <div className="form-grupo valor">
              <label>Numero NF</label>
              <input type="text" name="numeroNf" value={form.numeroNf} onChange={handleChange} maxLength="45" />
            </div>

            <div className="form-grupo nome" style={{ width: "520px" }}>
              <label>Chave NF</label>
              <input type="text" name="chaveNf" value={form.chaveNf} onChange={handleChange} maxLength="44" />
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo valor">
              <label>Data emissao</label>
              <input type="date" name="dataEmissao" value={form.dataEmissao} onChange={handleChange} />
            </div>

            <div className="form-grupo valor">
              <label>Data lancamento</label>
              <input type="date" name="dataLancamento" value={form.dataLancamento} onChange={handleChange} />
            </div>

            <div className="form-grupo valor">
              <label>Data vencimento</label>
              <input type="date" name="dataVencimento" value={form.dataVencimento} onChange={handleChange} />
            </div>

            <div className="form-grupo valor">
              <label>Data pagamento</label>
              <input type="date" name="dataPagamento" value={form.dataPagamento} onChange={handleChange} />
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo valor">
              <label>Valor</label>
              <input type="text" name="valor" value={form.valor} onChange={handleValorChange} placeholder="0,00" />
            </div>

            <div className="form-grupo valor">
              <label>Juros</label>
              <input type="text" name="juros" value={form.juros} onChange={handleValorChange} placeholder="0,00" />
            </div>

            <div className="form-grupo valor">
              <label>Valor total</label>
              <input
                type="text"
                name="valorTotal"
                value={form.valorTotal}
                readOnly
                style={{ fontWeight: "700", color: "#c97b1d", backgroundColor: "#fffaf3" }}
              />
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo nome" style={{ width: "100%" }}>
              <label>Observacao</label>
              <textarea
                name="observacao"
                value={form.observacao}
                onChange={handleChange}
                maxLength="250"
                rows="3"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div className="barra-acoes" style={{ justifyContent: "flex-end" }}>
            <button className="botao-acao" title="Novo" onClick={handleNovo}>
              <FaPlus />
            </button>
            <button className="botao-acao" title="Salvar" onClick={handleSalvar} disabled={salvando}>
              <FaSave />
            </button>
          </div>

          <div className="form-linha" style={{ alignItems: "flex-end", marginTop: "20px" }}>
            <div className="form-grupo nome" style={{ width: "520px" }}>
              <label>Buscar conta</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Fornecedor, NF, situacao, data, valor..."
                  style={{ flex: 1, minWidth: 0 }}
                />
                <button className="botao-icone-busca" title="Buscar">
                  <FaSearch />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "15px" }}>
              <button className="botao-acao" title="Recarregar" onClick={listarContas}>
                <FaSyncAlt />
              </button>
            </div>
          </div>

          {erro && <p style={{ color: "#b91c1c", marginTop: 0 }}>{erro}</p>}

          <div style={{ marginTop: "20px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Codigo</th>
                  <th style={th}>Fornecedor</th>
                  <th style={th}>NF</th>
                  <th style={th}>Vencimento</th>
                  <th style={th}>Pagamento</th>
                  <th style={th}>Valor total</th>
                  <th style={th}>Situacao</th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td style={tdMensagem} colSpan="7">
                      Carregando contas...
                    </td>
                  </tr>
                ) : contasFiltradas.length === 0 ? (
                  <tr>
                    <td style={tdMensagem} colSpan="7">
                      Nenhuma conta encontrada.
                    </td>
                  </tr>
                ) : (
                  contasFiltradas.map((conta) => (
                    <tr
                      key={conta.idCap}
                      onClick={() => selecionar(conta)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: conta.idCap === form.idCap ? "#fff7ec" : "",
                      }}
                    >
                      <td style={td}>{conta.idCap}</td>
                      <td style={td}>{conta.fornecedor || "-"}</td>
                      <td style={td}>{conta.numeroNf || "-"}</td>
                      <td style={td}>{formatarData(conta.dataVencimento)}</td>
                      <td style={td}>{formatarData(conta.dataPagamento)}</td>
                      <td style={td}>R$ {formatarMoeda(conta.valorTotal)}</td>
                      <td style={td}>{conta.situacao || "-"}</td>
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
