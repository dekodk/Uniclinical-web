import "./cadastros.css";
import { useEffect, useState } from "react";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";

export default function Colaboradores() {
  const [idUser, setIdUser] = useState("");
  const [idLogin, setIdLogin] = useState("");
  const [idSenha, setIdSenha] = useState("");
  const [nomeUser, setNomeUser] = useState("");
  const [nivel, setNivel] = useState("USUARIO");
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState([]);

  useEffect(() => {
    listar();
  }, []);

  function novo() {
    setIdUser("");
    setIdLogin("");
    setIdSenha("");
    setNomeUser("");
    setNivel("USUARIO");
  }

  async function listar() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/colaboradores", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setLista(data);
  }

  async function salvar() {
    const token = localStorage.getItem("token");

    const metodo = idUser ? "PUT" : "POST";
    const url = idUser
      ? `http://localhost:8080/colaboradores/${idUser}`
      : "http://localhost:8080/colaboradores";

    const body = {
      idLogin,
      nomeUser,
      nivel,
      ativo: true,
    };

    if (idSenha.trim() !== "") {
      body.idSenha = idSenha;
    }

    if (!nomeUser || nomeUser.trim() === "") {
      alert("Informe o nome do colaborador.");
      return;
    }

    if (!idLogin || idLogin.trim() === "") {
      alert("Informe o login.");
      return;
    }

    if (!nivel || nivel.trim() === "") {
      alert("Informe o nível.");
      return;
    }

    if (!idUser && (!idSenha || idSenha.trim() === "")) {
      alert("Informe a senha.");
      return;
    }

    const response = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert("Colaborador salvo com sucesso!");
      novo();
      listar();
    } else {
      alert("Erro ao salvar colaborador.");
    }
  }

  async function inativar() {
    if (!idUser) {
      alert("Selecione um colaborador para inativar.");
      return;
    }

    const confirmar = confirm("Deseja inativar este colaborador?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8080/colaboradores/${idUser}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Colaborador inativado com sucesso!");
      novo();
      listar();
    } else {
      alert("Erro ao inativar colaborador.");
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
      `http://localhost:8080/colaboradores/buscar?nome=${encodeURIComponent(texto)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setLista(data);
  }

  function selecionar(colaborador) {
    setIdUser(colaborador.idUser);
    setIdLogin(colaborador.idLogin);
    setNomeUser(colaborador.nomeUser);
    setNivel(colaborador.nivel || "USUARIO");
    setIdSenha("");
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo">
        <h1>Cadastro de Colaboradores</h1>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card">
          <div className="form-linha">
            <div className="form-grupo codigo">
              <label>Código</label>
              <input type="text" value={idUser} readOnly />
            </div>

            <div className="form-grupo nome">
              <label>Nome do colaborador</label>
              <input
                type="text"
                value={nomeUser}
                onChange={(e) => setNomeUser(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", width: "240px" }}>
              <label style={{ fontSize: "15px", fontWeight: "600", color: "#444", marginBottom: "8px" }}>
                Login
              </label>
              <input
                type="text"
                value={idLogin}
                onChange={(e) => setIdLogin(e.target.value)}
                style={{
                  height: "42px",
                  padding: "0 12px",
                  border: "1px solid #d6d6d6",
                  borderRadius: "10px",
                  fontSize: "16px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", width: "240px" }}>
              <label style={{ fontSize: "15px", fontWeight: "600", color: "#444", marginBottom: "8px" }}>
                Senha
              </label>
              <input
                type="password"
                value={idSenha}
                onChange={(e) => setIdSenha(e.target.value)}
                placeholder={idUser ? "Deixe em branco para manter" : ""}
                style={{
                  height: "42px",
                  padding: "0 12px",
                  border: "1px solid #d6d6d6",
                  borderRadius: "10px",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "24px",
              alignItems: "center",
            }}
          >
            <label style={{ fontWeight: "600", color: "#444" }}>Nível:</label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="radio"
                name="nivel"
                value="USUARIO"
                checked={nivel === "USUARIO"}
                onChange={(e) => setNivel(e.target.value)}
              />
              Usuário
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="radio"
                name="nivel"
                value="ADMIN"
                checked={nivel === "ADMIN"}
                onChange={(e) => setNivel(e.target.value)}
              />
              Administrador
            </label>
          </div>

          <div className="barra-acoes">
            <button className="botao-acao" title="Novo" onClick={novo}>
              <FaPlus />
            </button>

            <button className="botao-acao" title="Salvar" onClick={salvar}>
              <FaSave />
            </button>

            <button className="botao-acao botao-inativar" title="Inativar" onClick={inativar}>
              <FaBan />
            </button>
          </div>

          <div className="form-linha" style={{ marginTop: "20px" }}>
            <div className="form-grupo nome">
              <label>Buscar colaborador</label>
              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  const valor = e.target.value;
                  setBusca(valor);
                  buscar(valor);
                }}
                placeholder="Digite o nome do colaborador"
              />
            </div>
          </div>

          <div style={{ marginTop: "25px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Código</th>
                  <th style={{ textAlign: "left" }}>Nome</th>
                  <th style={{ textAlign: "left" }}>Login</th>
                  <th style={{ textAlign: "left" }}>Nível</th>
                </tr>
              </thead>

              <tbody>
                {lista.map((colaborador) => (
                  <tr
                    key={colaborador.idUser}
                    onClick={() => selecionar(colaborador)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        colaborador.idUser === idUser ? "#fff7ec" : "",
                    }}
                  >
                    <td>{colaborador.idUser}</td>
                    <td>{colaborador.nomeUser}</td>
                    <td>{colaborador.idLogin}</td>
                    <td>{colaborador.nivel}</td>
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