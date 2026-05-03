import { useEffect, useState } from "react";
import "./Cadastros.css";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";

export default function Insumos() {
  const [idInsumo, setIdInsumo] = useState("");
  const [nomeInsumo, setNomeInsumo] = useState("");
  const [insumos, setInsumos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    listarInsumos();
  }, []);

  async function listarInsumos() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/insumos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setInsumos(data);
  }

  function novo() {
    setIdInsumo("");
    setNomeInsumo("");
  }

  async function salvar() {
    const token = localStorage.getItem("token");

    const metodo = idInsumo ? "PUT" : "POST";
    const url = idInsumo
      ? `http://localhost:8080/insumos/${idInsumo}`
      : "http://localhost:8080/insumos";

    if (!nomeInsumo || nomeInsumo.trim() === "") {
      alert("Informe o nome do insumo.");
      return;
    }

    const response = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nomeInsumo,
        ativo: true,
      }),
    });

    if (response.ok) {
      alert("Insumo salvo com sucesso!");
      novo();
      listarInsumos();
    } else {
      alert("Erro ao salvar insumo.");
    }
  }

  async function buscarInsumos(valor) {
    const token = localStorage.getItem("token");
    const texto = (valor ?? "").trim();

    if (texto.length === 0) {
      await listarInsumos();
      return;
    }

    const response = await fetch(
      `http://localhost:8080/insumos/buscar?nome=${encodeURIComponent(texto)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setInsumos(data);
  }

  async function inativar() {
    if (!idInsumo) {
      alert("Selecione um insumo para inativar.");
      return;
    }

    const confirmar = confirm("Deseja inativar este insumo?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8080/insumos/${idInsumo}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Insumo inativado com sucesso!");
      novo();
      listarInsumos();
    } else {
      alert("Erro ao inativar insumo.");
    }
  }

  function selecionar(insumo) {
    setIdInsumo(insumo.idInsumo);
    setNomeInsumo(insumo.nomeInsumo);
  }

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
              <input type="text" value={idInsumo} readOnly />
            </div>

            <div className="form-grupo nome">
              <label>Nome do insumo</label>
              <input
                type="text"
                value={nomeInsumo}
                onChange={(e) => setNomeInsumo(e.target.value)}
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
              <label>Buscar insumo</label>
              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  const valor = e.target.value;
                  setBusca(valor);
                  buscarInsumos(valor);
                }}
                placeholder="Digite o nome do insumo"
              />
            </div>
          </div>

          <div style={{ marginTop: "25px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Código</th>
                  <th style={{ textAlign: "left" }}>Insumo</th>
                </tr>
              </thead>
              <tbody>
                {insumos.map((insumo) => (
                  <tr
                    key={insumo.idInsumo}
                    onClick={() => selecionar(insumo)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{insumo.idInsumo}</td>
                    <td>{insumo.nomeInsumo}</td>
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