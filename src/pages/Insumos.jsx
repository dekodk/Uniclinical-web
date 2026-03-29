import "./Cadastros.css";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";

export default function Insumos() {
  return (
    <div className="cadastros-page">
      <div className="cadastros-topo">
        <h1>Cadastro de Insumos</h1>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card">
          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Código</label>
              <input type="text" />
            </div>

            <div className="form-grupo nome">
              <label>Nome do insumo</label>
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