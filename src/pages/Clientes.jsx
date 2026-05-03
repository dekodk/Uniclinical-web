import "./cadastros.css";
import { FaPlus, FaSave, FaBan, FaPrint } from "react-icons/fa";
import { useState } from "react";

export default function Clientes() {
  const [cpf, setCpf] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("dados");
  const [anamnese, setAnamnese] = useState({
    cirurgia: "N",
    remedio: "N",
    anticoncepcional: "N",
    alergiaMedicamento: "N",
    tratamento: "N",
    pressao: "N",
    outro: "N",
  });

  const [endereco, setEndereco] = useState({
    codigo: "",
    cep: "",
    logradouro: "",
    complemento: "",
    unidade: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
  });

  const [idCliente, setIdCliente] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [cpfCliente, setCpfCliente] = useState("");
  const [rgCliente, setRgCliente] = useState("");
  const [dtnCliente, setDtnCliente] = useState("");
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState([]);

  function formatarCPF(valor) {
    let v = valor.replace(/\D/g, "");
    v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  }

  function formatarCEP(valor) {
    let v = valor.replace(/\D/g, "");
    v = v.slice(0, 8);
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    return v;
  }

  function handleEnderecoChange(e) {
    const { name, value } = e.target;

    setEndereco((prev) => ({
      ...prev,
      [name]: name === "cep" ? formatarCEP(value) : value,
    }));
  }

  async function salvarCliente() {
    const token = localStorage.getItem("token");

    if (!nomeCliente || nomeCliente.trim() === "") {
      alert("Informe o nome do cliente.");
      return;
    }

    if (!cpfCliente || cpfCliente.trim() === "") {
      alert("Informe o CPF.");
      return;
    }

    const metodo = idCliente ? "PUT" : "POST";
    const url = idCliente
      ? `http://localhost:8080/clientes/${idCliente}`
      : "http://localhost:8080/clientes";

    const response = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nomeCliente,
        cpfCliente,
        rgCliente,
        dtnCliente,
        ativo: true,
      }),
    });

    if (response.ok) {
      const clienteSalvo = await response.json();

      // 🔥 ESSA LINHA É O CORAÇÃO DO SISTEMA
      setIdCliente(clienteSalvo.idCliente);

      alert("Cliente salvo com sucesso!");
      listarClientes();
    } else {
      alert("Erro ao salvar cliente.");
    }
  }

  async function listarClientes() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/clientes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setLista(data);
  }

  function selecionar(cliente) {
    setIdCliente(cliente.idCliente);
    setNomeCliente(cliente.nomeCliente);
    setCpfCliente(cliente.cpfCliente);
    setRgCliente(cliente.rgCliente);
    setDtnCliente(cliente.dtnCliente);
  }

  async function buscarCEP() {
    const cepLimpo = endereco.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("CEP inválido. Digite 8 dígitos.");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      setEndereco((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        complemento: data.complemento || "",
        unidade: data.unidade || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao consultar o CEP.");
    }
  }

  function alterarAnamnese(campo, valor) {
    setAnamnese((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  return (



    <div className="cadastros-page">
      <div className="cadastros-topo">
        <h1>Cadastro de Clientes</h1>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card">
          <div style={{ marginBottom: "24px" }}>
            <button
              type="button"
              style={abaAtiva === "dados" ? estiloAbaAtiva : estiloAba}
              onClick={() => setAbaAtiva("dados")}
            >
              Dados básicos
            </button>

            <button
              type="button"
              style={abaAtiva === "endereco" ? estiloAbaAtiva : estiloAba}
              onClick={() => setAbaAtiva("endereco")}
            >
              Endereço
            </button>

            <button
              type="button"
              style={abaAtiva === "contatos" ? estiloAbaAtiva : estiloAba}
              onClick={() => setAbaAtiva("contatos")}
            >
              Contatos
            </button>

            <button
              type="button"
              style={abaAtiva === "ficha" ? estiloAbaAtiva : estiloAba}
              onClick={() => setAbaAtiva("ficha")}
            >
              Ficha Médica
            </button>
          </div>

          {abaAtiva !== "dados" && !idCliente && (
            <p style={{ color: "red", fontWeight: "600" }}>
              Salve os dados básicos do cliente antes de preencher esta aba.
            </p>
          )}

          {abaAtiva === "dados" && (
            <>
              <div className="form-linha">
                <div className="form-grupo codigo">
                  <label>Código</label>
                  <input type="text" value={idCliente} readOnly />
                </div>

                <div className="form-grupo nome">
                  <label>Nome do cliente</label>
                  <input
                    type="text"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-linha">
                <div className="form-grupo" style={{ width: "220px" }}>
                  <label>CPF</label>
                  <input
                    type="text"
                    value={cpfCliente}
                    onChange={(e) => setCpfCliente(formatarCPF(e.target.value))}
                  />
                </div>

                <div className="form-grupo" style={{ width: "220px" }}>
                  <label>Data de nascimento</label>
                  <input
                    type="date"
                    value={dtnCliente}
                    onChange={(e) => setDtnCliente(e.target.value)}
                  />
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
                  <input
                    type="text"
                    value={rgCliente}
                    onChange={(e) => setRgCliente(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {abaAtiva === "endereco" && idCliente && (
            <>
              <div className="form-linha">
                <div className="form-grupo" style={{ width: "150px" }}>
                  <label>Código</label>
                  <input
                    type="text"
                    name="codigo"
                    value={endereco.codigo}
                    onChange={handleEnderecoChange}
                  />
                </div>

                <div className="form-grupo" style={{ width: "180px" }}>
                  <label>CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={endereco.cep}
                    onChange={handleEnderecoChange}
                    placeholder="00000-000"
                  />
                </div>

                <div className="form-grupo" style={{ alignSelf: "end" }}>
                  <button
                    type="button"
                    onClick={buscarCEP}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#c97b1d",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "600",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Buscar CEP
                  </button>
                </div>
              </div>

              <div className="form-linha">
                <div className="form-grupo" style={{ width: "420px" }}>
                  <label>Logradouro</label>
                  <input
                    type="text"
                    name="logradouro"
                    value={endereco.logradouro}
                    onChange={handleEnderecoChange}
                  />
                </div>

                <div className="form-grupo" style={{ width: "120px" }}>
                  <label>Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={endereco.numero}
                    onChange={handleEnderecoChange}
                  />
                </div>
              </div>

              <div className="form-linha">
                <div className="form-grupo" style={{ width: "220px" }}>
                  <label>Complemento</label>
                  <input
                    type="text"
                    name="complemento"
                    value={endereco.complemento}
                    onChange={handleEnderecoChange}
                  />
                </div>

                <div className="form-grupo" style={{ width: "180px" }}>
                  <label>Unidade</label>
                  <input
                    type="text"
                    name="unidade"
                    value={endereco.unidade}
                    onChange={handleEnderecoChange}
                  />
                </div>

                <div className="form-grupo" style={{ width: "220px" }}>
                  <label>Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={endereco.bairro}
                    onChange={handleEnderecoChange}
                  />
                </div>
              </div>

              <div className="form-linha">
                <div className="form-grupo" style={{ width: "220px" }}>
                  <label>Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={endereco.cidade}
                    onChange={handleEnderecoChange}
                  />
                </div>

                <div className="form-grupo" style={{ width: "100px" }}>
                  <label>Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={endereco.estado}
                    onChange={handleEnderecoChange}
                    maxLength={2}
                  />
                </div>
              </div>
            </>
          )}

          {abaAtiva === "contatos" && idCliente && (
            <>
              <div className="form-linha">
                <div className="form-grupo" style={{ width: "220px" }}>
                  <label>Telefone</label>
                  <input type="text" />
                </div>

                <div className="form-grupo" style={{ width: "320px" }}>
                  <label>E-mail</label>
                  <input type="email" />
                </div>
              </div>
            </>)}
          {abaAtiva === "ficha" && idCliente && (<>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "60px" }}>
              <div>
                {/* COLUNA ESQUERDA */}
                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Já fez alguma cirurgia?</label>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <select
                      value={anamnese.cirurgia}
                      onChange={(e) => alterarAnamnese("cirurgia", e.target.value)}
                    >
                      <option value="N">Não</option>
                      <option value="S">Sim</option>
                    </select>

                    {anamnese.cirurgia === "S" && (
                      <>
                        <label>Qual?</label>
                        <input
                          type="text"
                          style={{ width: "250px" }}
                          placeholder="Descreva..."
                        />
                      </>
                    )}

                  </div>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Toma algum remédio?</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <select
                      value={anamnese.remedio}
                      onChange={(e) => alterarAnamnese("remedio", e.target.value)}
                    >
                      <option value="N">Não</option>
                      <option value="S">Sim</option>
                    </select>

                    {anamnese.remedio === "S" && (
                      <>
                        <label>Qual?</label>
                        <input
                          type="text"
                          style={{ width: "250px" }}
                          placeholder="Descreva..."
                        />
                      </>
                    )}

                  </div>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Toma anticoncepcional?</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <select
                      value={anamnese.anticoncepcional}
                      onChange={(e) => alterarAnamnese("anticoncepcional", e.target.value)}
                    >
                      <option value="N">Não</option>
                      <option value="S">Sim</option>
                    </select>

                    {anamnese.anticoncepcional === "S" && (
                      <>
                        <label>Qual?</label>
                        <input
                          type="text"
                          style={{ width: "250px" }}
                          placeholder="Descreva..."
                        />
                      </>
                    )}

                  </div>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Alergia a algum medicamento?</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <select
                      value={anamnese.alergiaMedicamento}
                      onChange={(e) => alterarAnamnese("alergiaMedicamento", e.target.value)}
                    >
                      <option value="N">Não</option>
                      <option value="S">Sim</option>
                    </select>

                    {anamnese.alergiaMedicamento === "S" && (
                      <>
                        <label>Qual?</label>
                        <input
                          type="text"
                          style={{ width: "250px" }}
                          placeholder="Descreva..."
                        />
                      </>
                    )}

                  </div>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Faz algum tratamento?</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <select
                      value={anamnese.tratamento}
                      onChange={(e) => alterarAnamnese("tratamento", e.target.value)}
                    >
                      <option value="N">Não</option>
                      <option value="S">Sim</option>
                    </select>

                    {anamnese.tratamento === "S" && (
                      <>
                        <label>Qual?</label>
                        <input
                          type="text"
                          style={{ width: "250px" }}
                          placeholder="Descreva..."
                        />
                      </>
                    )}

                  </div>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Sabe a sua pressão?</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <select
                      value={anamnese.pressao}
                      onChange={(e) => alterarAnamnese("pressao", e.target.value)}
                    >
                      <option value="N">Não</option>
                      <option value="S">Sim</option>
                    </select>

                    {anamnese.pressao === "S" && (
                      <>
                        <label>Qual?</label>
                        <input
                          type="text"
                          style={{ width: "250px" }}
                          placeholder="Descreva..."
                        />
                      </>
                    )}

                  </div>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Gostaria de relatar outro problema?</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <select
                      value={anamnese.outro}
                      onChange={(e) => alterarAnamnese("outro", e.target.value)}
                    >
                      <option value="N">Não</option>
                      <option value="S">Sim</option>
                    </select>

                    {anamnese.outro === "S" && (
                      <>
                        <label>Qual?</label>
                        <input
                          type="text"
                          style={{ width: "250px" }}
                          placeholder="Descreva..."
                        />
                      </>
                    )}

                  </div>

                </div>
                <button className="botao-acao" title="Imprimir">
                  <FaPrint />
                </button>
              </div>

              <div>
                {/* COLUNA DIREITA */}
                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Está gestante?</label>
                  <select
                    value={anamnese.gestante}
                    onChange={(e) => alterarAnamnese("gestante", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Problemas de rins ou fígado?</label>
                  <select
                    value={anamnese.rins}
                    onChange={(e) => alterarAnamnese("rins", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Fumante?</label>
                  <select
                    value={anamnese.fumante}
                    onChange={(e) => alterarAnamnese("fumante", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Ja teve hepátite?</label>
                  <select
                    value={anamnese.hepatite}
                    onChange={(e) => alterarAnamnese("hepatite", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Tem diabetes?</label>
                  <select
                    value={anamnese.diabetes}
                    onChange={(e) => alterarAnamnese("diabetes", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Tem asma?</label>
                  <select
                    value={anamnese.asma}
                    onChange={(e) => alterarAnamnese("asma", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Tem problemas cardíacos?</label>
                  <select
                    value={anamnese.cardiacos}
                    onChange={(e) => alterarAnamnese("cardiacos", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Ja teve convulsão?</label>
                  <select
                    value={anamnese.convulsao}
                    onChange={(e) => alterarAnamnese("convulsao", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>

                <div className="form-grupo form-grupo-select-curto">
                  <label className="label-largo">Costuma sentir tontura?</label>
                  <select
                    value={anamnese.tontura}
                    onChange={(e) => alterarAnamnese("tontura", e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </div>
              </div>
            </div>

          </>)}

          <div className="barra-acoes">
            <button className="botao-acao" title="Novo">
              <FaPlus />
            </button>

            <button className="botao-acao" title="Salvar" onClick={salvarCliente}>
              <FaSave />
            </button>

            <button className="botao-acao botao-inativar" title="Inativar">
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