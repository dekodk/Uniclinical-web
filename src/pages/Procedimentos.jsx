import { useState } from "react";
import "./Cadastros.css";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";

export default function Procedimentos() {
  const [valor, setValor] = useState("");
  function formatarValor(valorDigitado) {
  const somenteNumeros = valorDigitado.replace(/\D/g, "");

  const numero = Number(somenteNumeros) / 100;

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
  return (
    <div className="cadastros-page">
      <div className="cadastros-topo">
        <h1>Cadastro de Procedimentos</h1>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card">
          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Código</label>
              <input type="text" />
            </div>

            <div className="form-grupo nome">
              <label>Nome do procedimento</label>
              <input type="text" />
            </div>

            <div className="form-grupo valor">
              <label>Valor</label>
              <input
                type="text"
                value={valor}
                onChange={(e) => setValor(formatarValor(e.target.value))}
                placeholder="0,00"
              />
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