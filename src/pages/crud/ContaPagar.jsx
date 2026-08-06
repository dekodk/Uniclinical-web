import { useState } from "react";
import { FaSearch, FaPlus, FaSave, FaPen } from "react-icons/fa";
import "../Cadastros.css";

const FORMULARIO_INICIAL = {
  codigo: "",
  codigoAgendamento: "",
  nomeCliente: "",
  dataPagamento: "",
  dataAgendamento: "",
  valor: "",
  formaPagamento: "DINHEIRO",
  situacao: "ABERTO",
  origem: "",
};

export default function ContaPagar({ onVoltar }) {
  const [form, setForm] = useState({ ...FORMULARIO_INICIAL });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleNovo() {
    setForm({ ...FORMULARIO_INICIAL });
  }

  function handleSalvar() {
    alert("Salvar contas a pagar ainda não implementado.");
  }

  function handleAtualizar() {
    alert("Atualizar contas a pagar ainda não implementado.");
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
        <div className="cadastros-card">
          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Código</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <button className="botao-icone-busca" onClick={() => alert("Buscar código")}> 
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="form-grupo nome" style={{ width: "320px" }}>
              <label>Código do Agendamento</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  name="codigoAgendamento"
                  value={form.codigoAgendamento}
                  onChange={handleChange}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <button className="botao-icone-busca" onClick={() => alert("Buscar agendamento")}> 
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo nome" style={{ width: "100%" }}>
              <label>Nome do Cliente</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  name="nomeCliente"
                  value={form.nomeCliente}
                  onChange={handleChange}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <button className="botao-icone-busca" onClick={() => alert("Buscar cliente")}> 
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo valor">
              <label>Data do Pagamento</label>
              <input
                type="date"
                name="dataPagamento"
                value={form.dataPagamento}
                onChange={handleChange}
              />
            </div>

            <div className="form-grupo valor">
              <label>Valor</label>
              <input
                type="text"
                name="valor"
                value={form.valor}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo valor">
              <label>Data Agendamento</label>
              <input
                type="date"
                name="dataAgendamento"
                value={form.dataAgendamento}
                onChange={handleChange}
              />
            </div>

            <div className="form-grupo valor">
              <label>Forma de Pagamento</label>
              <select
                name="formaPagamento"
                value={form.formaPagamento}
                onChange={handleChange}
              >
                <option value="DINHEIRO">DINHEIRO</option>
                <option value="CARTAO">CARTÃO</option>
                <option value="PIX">PIX</option>
                <option value="CHEQUE">CHEQUE</option>
              </select>
            </div>
          </div>

          <div className="form-linha">
            <div className="form-grupo valor">
              <label>Situação</label>
              <select
                name="situacao"
                value={form.situacao}
                onChange={handleChange}
              >
                <option value="ABERTO">ABERTO</option>
                <option value="PAGO">PAGO</option>
                <option value="VENCIDO">VENCIDO</option>
              </select>
            </div>

            <div className="form-grupo nome" style={{ width: "100%" }}>
              <label>Origem</label>
              <input
                type="text"
                name="origem"
                value={form.origem}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="barra-acoes" style={{ justifyContent: "flex-end" }}>
            <button className="botao-acao" title="Novo" onClick={handleNovo}>
              <FaPlus />
            </button>
            <button className="botao-acao" title="Atualizar" onClick={handleAtualizar}>
              <FaPen />
            </button>
            <button className="botao-acao" title="Salvar" onClick={handleSalvar}>
              <FaSave />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
