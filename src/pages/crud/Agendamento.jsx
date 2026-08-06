import { useEffect, useState } from "react";
import "../Cadastros.css";

export default function Agendamento({ agendamentoSelecionado, onSaveComplete, onVoltar }) {
  const [clientePesquisa, setClientePesquisa] = useState("");
  const [clienteResultados, setClienteResultados] = useState([]);
  const [mostrarListaCliente, setMostrarListaCliente] = useState(false);
  const [procPesquisa, setProcPesquisa] = useState("");
  const [procResultados, setProcResultados] = useState([]);
  const [mostrarListaProc, setMostrarListaProc] = useState(false);
  const [colabPesquisa, setColabPesquisa] = useState("");
  const [colabResultados, setColabResultados] = useState([]);
  const [mostrarListaColab, setMostrarListaColab] = useState(false);
  const [insumoPesquisa, setInsumoPesquisa] = useState("");
  const [insumoResultados, setInsumoResultados] = useState([]);
  const [mostrarListaInsumo, setMostrarListaInsumo] = useState(false);

  const [form, setForm] = useState({
    idAgendamento: "",
    clienteId: "",
    clienteNome: "",

    procedimentoId: "",
    procedimentoNome: "",

    insumoId: "",
    insumoNome: "",

    colaboradorId: "",
    colaboradorNome: "",

    sala: "",
    data: "",
    hora: "",

    valorProcedimento: "",
    descontoAcrescimo: "",
    valorTotal: "",

    observacao: "",
  });

  function resetForm() {
    setForm({
      idAgendamento: "",
      clienteId: "",
      clienteNome: "",
      procedimentoId: "",
      procedimentoNome: "",
      insumoId: "",
      insumoNome: "",
      colaboradorId: "",
      colaboradorNome: "",
      sala: "",
      data: "",
      hora: "",
      valorProcedimento: "",
      descontoAcrescimo: "",
      valorTotal: "",
      observacao: "",
    });
    setClientePesquisa("");
    setProcPesquisa("");
    setColabPesquisa("");
    setInsumoPesquisa("");
    setClienteResultados([]);
    setProcResultados([]);
    setColabResultados([]);
    setInsumoResultados([]);
  }

  useEffect(() => {
    if (!agendamentoSelecionado) {
      resetForm();
      return;
    }

    setForm({
      idAgendamento: agendamentoSelecionado.idAgendamento || "",
      clienteId: agendamentoSelecionado.idCliente || "",
      clienteNome: agendamentoSelecionado.nomeCliente || "",
      procedimentoId: agendamentoSelecionado.procedimentoId || "",
      procedimentoNome: agendamentoSelecionado.nomeProcedimento || "",
      insumoId: agendamentoSelecionado.insumoId || "",
      insumoNome: agendamentoSelecionado.nomeInsumo || "",
      colaboradorId: agendamentoSelecionado.colaboradorId || "",
      colaboradorNome: agendamentoSelecionado.nomeUser || "",
      sala: agendamentoSelecionado.consultorio || "",
      data: agendamentoSelecionado.dataAgendamento || "",
      hora: agendamentoSelecionado.horaAgendamento || "",
      valorProcedimento: formatarMoeda(agendamentoSelecionado.valorProcedimento ?? 0),
      descontoAcrescimo: formatarMoeda(agendamentoSelecionado.valorAdicional ?? 0),
      valorTotal: formatarMoeda(agendamentoSelecionado.valorTotal ?? 0),
      observacao: agendamentoSelecionado.observacao || "",
    });

    setClientePesquisa(agendamentoSelecionado.nomeCliente || "");
    setProcPesquisa(agendamentoSelecionado.nomeProcedimento || "");
    setColabPesquisa(agendamentoSelecionado.nomeUser || "");
    setInsumoPesquisa(agendamentoSelecionado.nomeInsumo || "");
  }, [agendamentoSelecionado]);

  useEffect(() => {
    calcularValorTotal();
  }, [form.valorProcedimento, form.descontoAcrescimo]);

  async function buscarClientes(valor) {
    const token = localStorage.getItem("token");
    const texto = valor.trim();

    if (!texto) {
      setClienteResultados([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/clientes/buscar?nome=${encodeURIComponent(texto)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setClienteResultados(data);
      } else {
        console.error("Erro ao buscar clientes:", response.status);
        setClienteResultados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setClienteResultados([]);
    }
  }

  async function buscarProcedimentos(valor) {
    const token = localStorage.getItem("token");
    const texto = valor.trim();

    if (!texto) {
      setProcResultados([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/procedimentos/buscar?nome=${encodeURIComponent(texto)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProcResultados(Array.isArray(data) ? data : []);
      } else {
        console.error("Erro ao buscar procedimentos:", response.status);
        setProcResultados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar procedimentos:", error);
      setProcResultados([]);
    }
  }

  async function buscarColaboradores(valor) {
    const token = localStorage.getItem("token");
    const texto = valor.trim();

    if (!texto) {
      setColabResultados([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/colaboradores/buscar?nome=${encodeURIComponent(texto)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setColabResultados(Array.isArray(data) ? data : []);
      } else {
        console.error("Erro ao buscar colaboradores:", response.status);
        setColabResultados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
      setColabResultados([]);
    }
  }

  async function buscarInsumos(valor) {
    const token = localStorage.getItem("token");
    const texto = valor.trim();

    if (!texto) {
      setInsumoResultados([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/insumos/buscar?nome=${encodeURIComponent(texto)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInsumoResultados(Array.isArray(data) ? data : []);
      } else {
        console.error("Erro ao buscar insumos:", response.status);
        setInsumoResultados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar insumos:", error);
      setInsumoResultados([]);
    }
  }

  async function salvarAgendamento() {
    const token = localStorage.getItem("token");

    const dadosAgendamento = {
      ...(form.idAgendamento ? { idAgendamento: Number(form.idAgendamento) } : {}),
      idCliente: Number(form.clienteId) || null,
      nomeCliente: form.clienteNome,
      nomeProcedimento: form.procedimentoNome,
      valorProcedimento: converterValorBRParaNumero(form.valorProcedimento),
      nomeInsumo: form.insumoNome,
      valorAdicional: converterValorBRParaNumero(form.descontoAcrescimo),
      valorTotal: converterValorBRParaNumero(form.valorTotal),
      observacao: form.observacao,
      nomeUser: form.colaboradorNome,
      situacao: true,
      horaAgendamento: form.hora,
      consultorio: form.sala,
      dataAgendamento: form.data,
    };

    try {
      const isEdicao = Boolean(form.idAgendamento);
      const url = isEdicao
        ? `http://localhost:8080/agendamentos/${form.idAgendamento}`
        : "http://localhost:8080/agendamentos";

      const response = await fetch(url, {
        method: isEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAgendamento)
      });

      if (response.ok) {
        alert(isEdicao ? "Agendamento atualizado com sucesso!" : "Agendamento salvo com sucesso!");
        if (onSaveComplete) onSaveComplete();
      } else {
        alert("Erro ao salvar agendamento.");
      }

    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function formatarValor(valorDigitado) {
    const negativo = valorDigitado.startsWith("-");
    const somenteNumeros = valorDigitado.replace(/\D/g, "");

    if (!somenteNumeros) {
      return "";
    }

    const numero = Number(somenteNumeros) / 100;

    const valorFormatado = numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return negativo ? `-${valorFormatado}` : valorFormatado;
  }

  function handleDescontoAcrescimoChange(e) {
    const valorFormatado = formatarValor(e.target.value);

    setForm((prev) => ({
      ...prev,
      descontoAcrescimo: valorFormatado,
    }));
  }

  function converterValorBRParaNumero(valor) {
    if (!valor) return 0;

    let valorTratado = String(valor).trim();

    const negativo = valorTratado.startsWith("-");
    valorTratado = valorTratado.replace("-", "");
    valorTratado = valorTratado.replace(/\./g, "");
    valorTratado = valorTratado.replace(",", ".");

    const numero = parseFloat(valorTratado) || 0;
    return negativo ? -numero : numero;
  }

  function calcularValorTotal() {
    const valorProcedimento = converterValorBRParaNumero(form.valorProcedimento);
    const descontoAcrescimo = converterValorBRParaNumero(form.descontoAcrescimo);

    const total = valorProcedimento + descontoAcrescimo;

    setForm((prev) => ({
      ...prev,
      valorTotal: formatarMoeda(total),
    }));
  }

  function formatarMoeda(valor) {
    if (valor === "" || valor === null || valor === undefined) return "";

    const numero = typeof valor === "number"
      ? valor
      : converterValorBRParaNumero(String(valor));

    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Agendamento</h1>
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
        <div className="cadastros-card">
          <div className="form-linha">
            <div style={{ position: "relative", width: "320px" }}>
              <div className="form-grupo" style={{ marginBottom: 0 }}>
                <label>Cliente</label>
                <input
                  type="text"
                  value={clientePesquisa}
                  placeholder="Digite o nome do cliente"
                  onChange={(e) => {
                    const valor = e.target.value;
                    setClientePesquisa(valor);
                    setMostrarListaCliente(true);
                    buscarClientes(valor);
                  }}
                  onFocus={() => {
                    setMostrarListaCliente(true);
                    if (clientePesquisa) {
                      buscarClientes(clientePesquisa);
                    }
                  }}
                  onBlur={() => setTimeout(() => setMostrarListaCliente(false), 150)}
                />
              </div>

              {mostrarListaCliente && clientePesquisa && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {clienteResultados.length > 0 ? (
                    clienteResultados.map((cliente) => (
                      <div
                        key={cliente.idCliente ?? cliente.id}
                        onMouseDown={() => {
                          const clienteId = cliente.idCliente ?? cliente.id ?? "";
                          const clienteNome = cliente.nomeCliente ?? cliente.nome ?? "";

                          setForm((prev) => ({
                            ...prev,
                            clienteId,
                            clienteNome,
                          }));
                          setClientePesquisa(clienteNome);
                          setClienteResultados([]);
                          setMostrarListaCliente(false);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {cliente.idCliente ?? cliente.id} - {cliente.nomeCliente ?? cliente.nome}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px" }}>Nenhum resultado</div>
                  )}
                </div>
              )}
            </div>

            <div className="form-grupo" style={{ width: "160px" }}>
              <label>Data</label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
              />
            </div>

            <div className="form-grupo" style={{ width: "140px" }}>
              <label>Hora</label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
              />
            </div>

            <div className="form-grupo" style={{ width: "120px" }}>
              <label>Sala</label>
              <select
                name="sala"
                value={form.sala}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Sala 1">Sala 1</option>
                <option value="Sala 2">Sala 2</option>
                <option value="Sala 3">Sala 3</option>
                <option value="Sala 4">Sala 4</option>
              </select>
            </div>
          </div>

          <div className="form-linha">
            <div style={{ position: "relative", width: "320px" }}>
              <div className="form-grupo" style={{ marginBottom: 0 }}>
                <label>Procedimento</label>
                <input
                  type="text"
                  value={procPesquisa}
                  placeholder="Digite o procedimento"
                  onChange={(e) => {
                    const valor = e.target.value;
                    setProcPesquisa(valor);
                    setMostrarListaProc(true);
                    buscarProcedimentos(valor);
                  }}
                  onFocus={() => {
                    setMostrarListaProc(true);
                    if (procPesquisa) {
                      buscarProcedimentos(procPesquisa);
                    }
                  }}
                  onBlur={() => setTimeout(() => setMostrarListaProc(false), 150)}
                />
              </div>

              {mostrarListaProc && procPesquisa && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {procResultados.length > 0 ? (
                    procResultados.map((proc) => (
                      <div
                        key={proc.idProcedimento ?? proc.id}
                        onMouseDown={() => {
                          const procedimentoId = proc.idProcedimento ?? proc.id ?? "";
                          const procedimentoNome = proc.nomeProcedimento ?? proc.nome ?? "";

                          setForm((prev) => ({
                            ...prev,
                            procedimentoId,
                            procedimentoNome,
                            valorProcedimento: formatarMoeda(proc.valorProcedimento ?? proc.valor ?? 0),
                          }));
                          setProcPesquisa(procedimentoNome);
                          setProcResultados([]);
                          setMostrarListaProc(false);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>
                            {proc.idProcedimento ?? proc.id} - {proc.nomeProcedimento ?? proc.nome}
                          </span>
                          {(proc.valorProcedimento != null || proc.valor != null) && (
                            <span style={{ color: "#666" }}>
                              {Number(proc.valorProcedimento ?? proc.valor).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px" }}>Nenhum resultado</div>
                  )}
                </div>
              )}
            </div>

            <div className="form-grupo" style={{ width: "120px" }}>
              <label>Valor</label>
              <input
                type="text"
                name="valorProcedimento"
                value={formatarMoeda(form.valorProcedimento)}
                readOnly
              />
            </div>

            <div className="form-grupo" style={{ width: "150px" }}>
              <label>Desc./Acrésc.</label>
              <input
                type="text"
                name="descontoAcrescimo"
                value={form.descontoAcrescimo}
                onChange={handleDescontoAcrescimoChange}
                placeholder="0,00"
              />
            </div>

            <div className="form-grupo" style={{ width: "120px" }}>
              <label>Total</label>
              <input
                type="text"
                name="valorTotal"
                value={formatarMoeda(form.valorTotal)}
                readOnly
                style={{
                  fontWeight: "700",
                  color: "#c97b1d",
                  backgroundColor: "#fffaf3",
                }}
              />
            </div>
          </div>

          <div className="form-linha">
            <div style={{ position: "relative", width: "320px" }}>
              <div className="form-grupo" style={{ marginBottom: 0 }}>
                <label>Colaborador</label>
                <input
                  type="text"
                  value={colabPesquisa}
                  placeholder="Digite o colaborador"
                  onChange={(e) => {
                    const valor = e.target.value;
                    setColabPesquisa(valor);
                    setMostrarListaColab(true);
                    buscarColaboradores(valor);
                  }}
                  onFocus={() => {
                    setMostrarListaColab(true);
                    if (colabPesquisa) {
                      buscarColaboradores(colabPesquisa);
                    }
                  }}
                  onBlur={() => setTimeout(() => setMostrarListaColab(false), 150)}
                />
              </div>

              {mostrarListaColab && colabPesquisa && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {colabResultados.length > 0 ? (
                    colabResultados.map((colaborador) => (
                      <div
                        key={colaborador.idUser ?? colaborador.id}
                        onMouseDown={() => {
                          const colaboradorId = colaborador.idUser ?? colaborador.id ?? "";
                          const colaboradorNome = colaborador.nomeUser ?? colaborador.nome ?? "";

                          setForm((prev) => ({
                            ...prev,
                            colaboradorId,
                            colaboradorNome,
                          }));
                          setColabPesquisa(colaboradorNome);
                          setColabResultados([]);
                          setMostrarListaColab(false);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {colaborador.idUser ?? colaborador.id} - {colaborador.nomeUser ?? colaborador.nome}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px" }}>Nenhum resultado</div>
                  )}
                </div>
              )}
            </div>

            <div style={{ position: "relative", width: "320px" }}>
              <div className="form-grupo" style={{ marginBottom: 0 }}>
                <label>Insumo</label>
                <input
                  type="text"
                  value={insumoPesquisa}
                  placeholder="Digite o insumo"
                  onChange={(e) => {
                    const valor = e.target.value;
                    setInsumoPesquisa(valor);
                    setMostrarListaInsumo(true);
                    buscarInsumos(valor);
                  }}
                  onFocus={() => {
                    setMostrarListaInsumo(true);
                    if (insumoPesquisa) {
                      buscarInsumos(insumoPesquisa);
                    }
                  }}
                  onBlur={() => setTimeout(() => setMostrarListaInsumo(false), 150)}
                />
              </div>

              {mostrarListaInsumo && insumoPesquisa && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {insumoResultados.length > 0 ? (
                    insumoResultados.map((insumo) => (
                      <div
                        key={insumo.idInsumo ?? insumo.id}
                        onMouseDown={() => {
                          const insumoId = insumo.idInsumo ?? insumo.id ?? "";
                          const insumoNome = insumo.nomeInsumo ?? insumo.nome ?? "";

                          setForm((prev) => ({
                            ...prev,
                            insumoId,
                            insumoNome,
                          }));
                          setInsumoPesquisa(insumoNome);
                          setInsumoResultados([]);
                          setMostrarListaInsumo(false);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {insumo.idInsumo ?? insumo.id} - {insumo.nomeInsumo ?? insumo.nome}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px" }}>Nenhum resultado</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo" style={{ width: "670px" }}>
              <label>Observação</label>
              <textarea
                name="observacao"
                value={form.observacao}
                onChange={handleChange}
                rows="4"
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
          <div style={{ marginTop: "20px" }}>
            <button
              type="button"
              onClick={salvarAgendamento}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#c97b1d",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
              }}
            >
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
