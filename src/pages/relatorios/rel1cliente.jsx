import { useEffect, useState } from "react";
import "../Cadastros.css";

export default function Rel1Cliente({ onVoltar }) {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  function formatarDataNascimento(valor) {
    if (!valor) return "";

    const data = String(valor).split("T")[0];
    const [ano, mes, dia] = data.split("-");
    if (!dia || !mes || !ano) return valor;

    return `${dia}/${mes}/${ano}`;
  }

  useEffect(() => {
    async function carregarClientes() {
      try {
        const rawToken = localStorage.getItem("token");
        const token = rawToken?.trim();
        if (!token) {
          throw new Error("Token não encontrado. Faça login novamente.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch("http://localhost:8080/clientes", {
          headers,
        });
        if (!response.ok) {
          throw new Error(`Erro ao carregar clientes: ${response.status}`);
        }

        const data = await response.json();
        const clientesOrdenados = data.sort((a, b) =>
          a.nomeCliente?.localeCompare(b.nomeCliente, "pt-BR", { sensitivity: "base" })
        );

        setClientes(clientesOrdenados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarClientes();
  }, []);

  const [imprimindo, setImprimindo] = useState(false);

  async function imprimirRelatorio() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    setImprimindo(true);
    try {
      const token = localStorage.getItem("token")?.trim();
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
      }

      console.log("[Rel1Cliente] imprimirRelatorio token=", token);
      const response = await fetch(`http://localhost:8080/relatorios/clientes/pdf?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const texto = await response.text();
        throw new Error(`Não foi possível gerar o relatório (${response.status}): ${texto}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      alert(error.message);
    } finally {
      setImprimindo(false);
    }
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Relatório de Clientes</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            className="botao-acao"
            style={{ minWidth: "120px", width: "auto", height: "42px", fontSize: "14px" }}
            onClick={onVoltar}
          >
            VOLTAR
          </button>
          <button
            type="button"
            className="botao-acao"
            style={{ minWidth: "120px", width: "auto", height: "42px", fontSize: "14px" }}
            onClick={imprimirRelatorio}
            disabled={imprimindo}
          >
            {imprimindo ? "Gerando..." : "IMPRIMIR"}
          </button>
        </div>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card" style={{ padding: "24px" }}>
          {carregando ? (
            <p>Carregando clientes...</p>
          ) : erro ? (
            <p style={{ color: "#d9534f" }}>Erro: {erro}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={headerCell}>Código</th>
                    <th style={headerCell}>Nome</th>
                    <th style={headerCell}>CPF</th>
                    <th style={headerCell}>RG</th>
                    <th style={headerCell}>Data Nasc.</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: "18px 12px", textAlign: "center" }}>
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  ) : (
                    clientes.map((cliente) => (
                      <tr key={cliente.idCliente} style={{ backgroundColor: "#fff" }}>
                        <td style={bodyCell}>{cliente.idCliente}</td>
                        <td style={bodyCell}>{cliente.nomeCliente}</td>
                        <td style={bodyCell}>{cliente.cpfCliente || ""}</td>
                        <td style={bodyCell}>{cliente.rgCliente || ""}</td>
                        <td style={bodyCell}>{formatarDataNascimento(cliente.dtnCliente)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const headerCell = {
  textAlign: "left",
  padding: "14px 12px",
  borderBottom: "2px solid #e5e5e5",
  color: "#333",
  fontWeight: 600,
  backgroundColor: "#fafafa",
};

const bodyCell = {
  padding: "14px 12px",
  borderBottom: "1px solid #eee",
  color: "#444",
};
