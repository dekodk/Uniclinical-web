import "./cadastros.css";
import { FaPlus, FaSave, FaBan } from "react-icons/fa";
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

          {abaAtiva === "dados" && (
            <>
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
            </>
          )}

          {abaAtiva === "endereco" && (
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

          {abaAtiva === "contatos" && (
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
          {abaAtiva === "ficha" && (<>
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

            </>)}

            <div className="barra-acoes">
              <button className="botao-acao" title="Novo">
                <FaPlus />
              </button>

              <button className="botao-acao" title="Salvar">
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