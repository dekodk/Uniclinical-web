import { useEffect, useState } from "react";
import "./Cadastros.css";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";

export default function Procedimentos() {
  const [idProcedimento, setIdProcedimento] = useState("");
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState([]);

  useEffect(() => {
    listar();
  }, []);

  function formatarValorDigitacao(valorDigitado) {
    const somenteNumeros = valorDigitado.replace(/\D/g, "");
    const numero = Number(somenteNumeros) / 100;

    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatarMoeda(valor) {
  if (!valor) return "0,00";

  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

  function converterValorBRParaNumero(valor) {
    if (!valor) return 0;
    return Number(valor.replace(/\./g, "").replace(",", "."));
  }

  function novo() {
    setIdProcedimento("");
    setNome("");
    setValor("");
  }

  async function listar() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/procedimentos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setLista(data);
  }

  async function salvar() {
    const token = localStorage.getItem("token");

    const metodo = idProcedimento ? "PUT" : "POST";
    const url = idProcedimento
      ? `http://localhost:8080/procedimentos/${idProcedimento}`
      : "http://localhost:8080/procedimentos";

    const response = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nomeProcedimento: nome,
        valorProcedimento: converterValorBRParaNumero(valor),
        ativo: true,
      }),
    });

    if (response.ok) {
      alert("Procedimento salvo com sucesso!");
      novo();
      listar();
    } else {
      alert("Erro ao salvar procedimento.");
    }
  }

  async function inativar() {
    if (!idProcedimento) {
      alert("Selecione um procedimento para inativar.");
      return;
    }

    const confirmar = confirm("Deseja inativar este procedimento?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8080/procedimentos/${idProcedimento}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      alert("Procedimento inativado com sucesso!");
      novo();
      listar();
    } else {
      alert("Erro ao inativar procedimento.");
    }
  }

  async function buscar(valorBusca) {
    const token = localStorage.getItem("token");
    const texto = (valorBusca ?? "").trim();

    if (texto === "") {
      listar();
      return;
    }

    const response = await fetch(
      `http://localhost:8080/procedimentos/buscar?nome=${encodeURIComponent(texto)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setLista(data);
  }

  function selecionar(procedimento) {
    setIdProcedimento(procedimento.idProcedimento);
    setNome(procedimento.nomeProcedimento);
    setValor(formatarMoeda(String(procedimento.valorProcedimento)));
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
              <input type="text" value={idProcedimento} readOnly />
            </div>

            <div className="form-grupo nome">
              <label>Nome do procedimento</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-grupo valor">
              <label>Valor</label>
              <input
                type="text"
                value={valor}
                onChange={(e) => setValor(formatarValorDigitacao(e.target.value))}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="barra-acoes">
            <button className="botao-acao" title="Novo" onClick={novo}>
              <FaPlus />
            </button>

            <button className="botao-acao" title="Salvar" onClick={salvar}>
              <FaSave />
            </button>

            <button
              className="botao-acao botao-inativar"
              title="Inativar"
              onClick={inativar}
            >
              <FaBan />
            </button>
          </div>

          <div className="form-linha" style={{ marginTop: "20px" }}>
            <div className="form-grupo nome">
              <label>Buscar procedimento</label>
              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  const valorDigitado = e.target.value;
                  setBusca(valorDigitado);
                  buscar(valorDigitado);
                }}
                placeholder="Digite o nome do procedimento"
              />
            </div>
          </div>

          <div style={{ marginTop: "25px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Código</th>
                  <th style={{ textAlign: "left" }}>Procedimento</th>
                  <th style={{ textAlign: "left" }}>Valor</th>
                </tr>
              </thead>

              <tbody>
                {lista.map((procedimento) => (
                  <tr
                    key={procedimento.idProcedimento}
                    onClick={() => selecionar(procedimento)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        procedimento.idProcedimento === idProcedimento
                          ? "#fff7ec"
                          : "",
                    }}
                  >
                    <td>{procedimento.idProcedimento}</td>
                    <td>{procedimento.nomeProcedimento}</td>
                    <td>
                      R$ {formatarMoeda(String(procedimento.valorProcedimento))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}