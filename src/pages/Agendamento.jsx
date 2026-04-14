import { useEffect, useState } from "react";
import "./Cadastros.css";
import BuscaAutocomplete from "../components/BuscaAutocomplete";

export default function Agendamento() {
  const [clientes, setClientes] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  const [form, setForm] = useState({
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

  useEffect(() => {
    carregarClientes();
    carregarProcedimentos();
    carregarInsumos();
    carregarColaboradores();
  }, []);

  useEffect(() => {
    calcularValorTotal();
  }, [form.valorProcedimento, form.descontoAcrescimo]);

  async function carregarClientes() {
    try {
      const response = await fetch("http://localhost:8080/clientes");
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  async function carregarProcedimentos() {
    try {
      const response = await fetch("http://localhost:8080/procedimentos");
      const data = await response.json();
      setProcedimentos(data);
    } catch (error) {
      console.error("Erro ao carregar procedimentos:", error);
    }
  }

  async function carregarInsumos() {
    try {
      const response = await fetch("http://localhost:8080/insumos");
      const data = await response.json();
      setInsumos(data);
    } catch (error) {
      console.error("Erro ao carregar insumos:", error);
    }
  }

  async function carregarColaboradores() {
    try {
      const response = await fetch("http://localhost:8080/colaboradores");
      const data = await response.json();
      setColaboradores(data);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
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
      valorTotal: total.toFixed(2),
    }));
  }

  function formatarMoeda(valor) {
    if (valor === "" || valor === null || valor === undefined) return "";
    return Number(valor).toLocaleString("pt-BR", {
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
            <BuscaAutocomplete
              label="Cliente"
              lista={clientes}
              campoBusca="nome"
              placeholder="Digite o nome do cliente"
              width="320px"
              onSelect={(cliente) =>
                setForm((prev) => ({
                  ...prev,
                  clienteId: cliente.id,
                  clienteNome: cliente.nome,
                }))
              }
            />

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
            <BuscaAutocomplete
              label="Procedimento"
              lista={procedimentos}
              campoBusca="nome"
              placeholder="Digite o procedimento"
              width="320px"
              onSelect={(proc) =>
                setForm((prev) => ({
                  ...prev,
                  procedimentoId: proc.id,
                  procedimentoNome: proc.nome,
                  valorProcedimento: String(proc.valor),
                }))
              }
            />

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
            <BuscaAutocomplete
              label="Colaborador"
              lista={colaboradores}
              campoBusca="nome"
              placeholder="Digite o colaborador"
              width="320px"
              onSelect={(colaborador) =>
                setForm((prev) => ({
                  ...prev,
                  colaboradorId: colaborador.id,
                  colaboradorNome: colaborador.nome,
                }))
              }
            />

            <BuscaAutocomplete
              label="Insumo"
              lista={insumos}
              campoBusca="nome"
              placeholder="Digite o insumo"
              width="320px"
              onSelect={(insumo) =>
                setForm((prev) => ({
                  ...prev,
                  insumoId: insumo.id,
                  insumoNome: insumo.nome,
                }))
              }
            />
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