import { useEffect, useState } from "react";
import "../Cadastros.css";

export default function Agendamento({ agendamentoSelecionado, onSaveComplete }) {
  const [procedimentos, setProcedimentos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
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
    carregarProcedimentos();
    carregarInsumos();
    carregarColaboradores();
  }, []);

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

  async function carregarProcedimentos() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/procedimentos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProcedimentos(data);
    } catch (error) {
      console.error("Erro ao carregar procedimentos:", error);
    }
  }

  async function carregarInsumos() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/insumos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setInsumos(data);
    } catch (error) {
      console.error("Erro ao carregar insumos:", error);
    }
  }

  async function carregarColaboradores() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/colaboradores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setColaboradores(data);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
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
      <div className="cadastros-topo">
        <h1>Agendamento</h1>
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
                          setForm((prev) => ({
                            ...prev,
                            clienteId: cliente.idCliente ?? cliente.id,
                            clienteNome: cliente.nomeCliente ?? cliente.nome,
                          }));
                          setClientePesquisa(cliente.nomeCliente ?? cliente.nome ?? "");
                          setClienteResultados([]);
                          setMostrarListaCliente(false);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {cliente.nomeCliente ?? cliente.nome}
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
                    const resultados = valor.trim()
                      ? procedimentos.filter((item) =>
                          (item.nomeProcedimento ?? item.nome ?? "")
                            .toLowerCase()
                            .includes(valor.toLowerCase())
                        )
                      : [];
                    setProcResultados(resultados);
                  }}
                  onFocus={() => setMostrarListaProc(true)}
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
                        key={proc.id}
                        onMouseDown={() => {
                          setForm((prev) => ({
                            ...prev,
                            procedimentoId: proc.id,
                            procedimentoNome: proc.nomeProcedimento ?? proc.nome,
                            valorProcedimento: formatarMoeda(proc.valorProcedimento ?? proc.valor ?? 0),
                          }));
                          setProcPesquisa(proc.nomeProcedimento ?? proc.nome ?? "");
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
                          <span>{proc.nomeProcedimento ?? proc.nome}</span>
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
                    const resultados = valor.trim()
                      ? colaboradores.filter((item) =>
                          (item.nomeUser ?? item.nome ?? "")
                            .toLowerCase()
                            .includes(valor.toLowerCase())
                        )
                      : [];
                    setColabResultados(resultados);
                  }}
                  onFocus={() => setMostrarListaColab(true)}
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
                        key={colaborador.id}
                        onMouseDown={() => {
                          setForm((prev) => ({
                            ...prev,
                            colaboradorId: colaborador.id,
                            colaboradorNome: colaborador.nomeUser ?? colaborador.nome,
                          }));
                          setColabPesquisa(colaborador.nomeUser ?? colaborador.nome ?? "");
                          setColabResultados([]);
                          setMostrarListaColab(false);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {colaborador.nomeUser ?? colaborador.nome}
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
                    const resultados = valor.trim()
                      ? insumos.filter((item) =>
                          (item.nomeInsumo ?? item.nome ?? "")
                            .toLowerCase()
                            .includes(valor.toLowerCase())
                        )
                      : [];
                    setInsumoResultados(resultados);
                  }}
                  onFocus={() => setMostrarListaInsumo(true)}
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
                        key={insumo.id}
                        onMouseDown={() => {
                          setForm((prev) => ({
                            ...prev,
                            insumoId: insumo.id,
                            insumoNome: insumo.nomeInsumo ?? insumo.nome,
                          }));
                          setInsumoPesquisa(insumo.nomeInsumo ?? insumo.nome ?? "");
                          setInsumoResultados([]);
                          setMostrarListaInsumo(false);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {insumo.nomeInsumo ?? insumo.nome}
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