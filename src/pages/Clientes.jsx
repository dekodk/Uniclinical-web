import "./cadastros.css";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";
import { useState } from "react";

export default function Clientes() {

  const [cpf, setCpf] = useState("");

  function formatarCPF(valor) {
    // remove tudo que não é número
    let v = valor.replace(/\D/g, "");

    // limita a 11 dígitos
    v = v.slice(0, 11);

    // aplica a máscara
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return v;
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo">
        <h1>Cadastro de Clientes</h1>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card">
          <div style={{ marginBottom: "24px" }}>
            <button type="button" style={estiloAbaAtiva}>
              Dados básicos
            </button>
            <button type="button" style={estiloAba}>
              Endereço
            </button>
            <button type="button" style={estiloAba}>
              Contatos
            </button>
            <button type="button" style={estiloAba}>
              Ficha anamnéstica
            </button>
          </div>

          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Código</label>
              <input type="text" />
            </div>

            <div className="form-grupo nome">
              <label>Nome do cliente</label>
              <input type="text" />
            </div>
          </div>

          <div className="form-linha">

            <div className="form-grupo" style={{ width: "220px" }}>
              <label>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
              />
            </div>

            <div className="form-grupo" style={{ width: "220px" }}>
              <label>Data de nascimento</label>
              <input type="date" />
            </div>

            <div className="form-grupo" style={{ width: "120px" }}>
              <label>Sexo</label>
              <select>
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro(a)</option>
              </select>
            </div>

          </div>

          <div className="form-linha">
            <div className="form-grupo" style={{ width: "180px" }}>
              <label>RG</label>
              <input type="text" />
            </div>
          </div>

          <div className="barra-acoes">
            <button className="botao-acao" title="Novo">
              <FaPlus />
            </button>

            <button className="botao-acao" title="Salvar">
              <FaSave />
            </button>

            <button
              className="botao-acao botao-inativar"
              title="Inativar"
            >
              <FaBan />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const estiloAba = {
  padding: "10px 18px",
  border: "1px solid #d6d6d6",
  borderRadius: "10px",
  backgroundColor: "#fff",
  cursor: "pointer",
  marginRight: "10px",
  fontSize: "15px",
  fontWeight: "600",
};

const estiloAbaAtiva = {
  ...estiloAba,
  backgroundColor: "#c97b1d",
  color: "#fff",
  border: "1px solid #c97b1d",
};