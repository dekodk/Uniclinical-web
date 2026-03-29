import "./cadastros.css";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";

export default function Clientes() {
  return (
    <div className="cadastros-page">
      <div className="cadastros-topo">
        <h1>Cadastro de clientes</h1>
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
              <input type="text" />
            </div>

            <div className="form-grupo" style={{ width: "220px" }}>
              <label>Data de nascimento</label>
              <input type="date" />
            </div>

            <div className="form-grupo" style={{ width: "220px" }}>
              <label>Sexo</label>
              <input type="text" />
            </div>
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