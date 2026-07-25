import "../cadastros.css";
import { FaPlus, FaSave, FaBan, FaTrash, FaEdit, FaPrint } from "react-icons/fa";
import { useState } from "react";

const ANAMNESE_INICIAL = {
  cirurgia: "N",
  cirurgiaQual: "",
  remedio: "N",
  remedioQual: "",
  anticoncepcional: "N",
  anticoncepcionalQual: "",
  alergiaMedicamento: "N",
  alergiaMedicamentoQual: "",
  tratamento: "N",
  tratamentoQual: "",
  pressao: "N",
  pressaoQual: "",
  outro: "N",
  outroQual: "",
  gestante: "N",
  rins: "N",
  fumante: "N",
  hepatite: "N",
  diabetes: "N",
  asma: "N",
  cardiacos: "N",
  convulsao: "N",
  tontura: "N",
};

export default function Clientes() {
  const [cpf, setCpf] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("dados");
  const [anamnese, setAnamnese] = useState({ ...ANAMNESE_INICIAL });

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
  const [sexoCliente, setSexoCliente] = useState("");
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

  function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
  }

  function formatarData(valor) {
    if (!valor) {
      return "";
    }

    const data = String(valor).split("T")[0];
    const partes = data.split("-");

    if (partes.length !== 3) {
      return valor;
    }

    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }

  function handleEnderecoChange(e) {
    const { name, value } = e.target;

    setEndereco((prev) => ({
      ...prev,
      [name]:
        name === "cep"
          ? formatarCEP(value)
          : name === "numero" || name === "unidade"
            ? somenteNumeros(value)
            : value,
    }));
  }

  const [novoContato, setNovoContato] = useState({
    tipo: "Telefone",
    valor: "",
    descricao: "",
  });

  const [contatos, setContatos] = useState([]);

  async function salvarCliente() {
    console.log("ENTROU NO salvarCliente");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

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
        dtnCliente: dtnCliente || null,
        sexoCliente,
        ativo: true,
      }),
    });

    if (response.ok) {
      const clienteSalvo = await response.json();

      // 🔥 ESSA LINHA É O CORAÇÃO DO SISTEMA
      setIdCliente(clienteSalvo.idCliente);

      alert("Cliente salvo com sucesso!");
      const textoBusca = (busca ?? "").trim();
      if (textoBusca) {
        buscarClientes(textoBusca);
      } else {
        setLista([]);
      }
    } else {
      const erro = await response.text();
      console.error("Erro ao salvar cliente:", response.status, erro);
      alert("Erro ao salvar cliente: " + (erro || response.statusText));
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

  async function buscarClientes(valorBusca) {
    const token = localStorage.getItem("token");
    const texto = (valorBusca ?? "").trim();

    if (texto === "") {
      setLista([]);
      return;
    }

    const response = await fetch(
      `http://localhost:8080/clientes/buscar?nome=${encodeURIComponent(texto)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setLista(data);
  }

  async function salvarEndereco() {
    console.log("ENTROU NO salvarEndereco");
    if (!idCliente) {
      alert("Salve os dados básicos do cliente antes de salvar o endereço.");
      return;
    }

    if (!endereco.logradouro || endereco.logradouro.trim() === "") {
      alert("Informe o logradouro.");
      return;
    }

    if (!endereco.bairro || endereco.bairro.trim() === "") {
      alert("Informe o bairro.");
      return;
    }

    if (!endereco.cidade || endereco.cidade.trim() === "") {
      alert("Informe a cidade.");
      return;
    }

    if (!endereco.estado || endereco.estado.trim() === "") {
      alert("Informe o estado.");
      return;
    }

    if (!endereco.cep || endereco.cep.trim() === "") {
      alert("Informe o CEP.");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8080/enderecos/${idCliente}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idCliente: Number(idCliente),
        lograEndereco: endereco.logradouro,
        bairroEndereco: endereco.bairro,
        cidadeEndereco: endereco.cidade,
        estadoEndereco: endereco.estado,
        cepEndereco: endereco.cep,
        compleEndereco: endereco.complemento,
        numeroEndereco: endereco.numero,
        unidadeEndereco: endereco.unidade,
      }),
    });

    if (response.ok) {
      alert("Endereço salvo com sucesso!");
    } else {
      alert("Erro ao salvar endereço.");
    }
  }

  async function buscarEndereco(idClienteSelecionado) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/enderecos/${idClienteSelecionado}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data) {
        setEndereco({
          codigo: data.idCliente || "",
          cep: data.cepEndereco || "",
          logradouro: data.lograEndereco || "",
          complemento: data.compleEndereco || "",
          unidade: data.unidadeEndereco || "",
          bairro: data.bairroEndereco || "",
          cidade: data.cidadeEndereco || "",
          estado: data.estadoEndereco || "",
          numero: data.numeroEndereco || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  }

  function selecionar(cliente) {
    setIdCliente(cliente.idCliente);
    setNomeCliente(cliente.nomeCliente);
    setCpfCliente(cliente.cpfCliente);
    setRgCliente(cliente.rgCliente);
    setDtnCliente(cliente.dtnCliente || "");
    setSexoCliente(cliente.sexoCliente || "");

    buscarEndereco(cliente.idCliente);
    buscarContatos(cliente.idCliente);
    buscarFichaMedica(cliente.idCliente);
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

  async function buscarContatos(idClienteSelecionado) {
    const token = localStorage.getItem("token");

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [responseEmails, responseTelefones] = await Promise.all([
        fetch(`http://localhost:8080/emails/cliente/${idClienteSelecionado}`, { headers }),
        fetch(`http://localhost:8080/telefones/cliente/${idClienteSelecionado}`, { headers }),
      ]);

      if (!responseEmails.ok || !responseTelefones.ok) {
        throw new Error("Não foi possível carregar os contatos do cliente.");
      }

      const [emails, telefones] = await Promise.all([
        responseEmails.json(),
        responseTelefones.json(),
      ]);

      const contatosCarregados = [
        ...telefones.map((telefone) => ({
          id: `telefone-${telefone.idtelefone}`,
          idRegistro: telefone.idtelefone,
          origem: "telefone",
          tipo: telefone.tipofoneCliente || "Telefone",
          valor: telefone.foneCliente,
          descricao: telefone.descObsCliente || "",
          dataCadastro: telefone.dataCadFoneCliente || "",
        })),
        ...emails.map((email) => ({
          id: `email-${email.idemail}`,
          idRegistro: email.idemail,
          origem: "email",
          tipo: email.tipoEmailCliente || "E-mail",
          valor: email.emailCliente,
          descricao: email.descObsCliente || "",
          dataCadastro: email.dataCadEmail || "",
        })),
      ];

      setContatos(contatosCarregados);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      setContatos([]);
    }
  }

  function alterarAnamnese(campo, valor) {
    setAnamnese((prev) => ({
      ...prev,
      [campo]: valor,
      ...(valor === "N" && `${campo}Qual` in prev ? { [`${campo}Qual`]: "" } : {}),
    }));
  }

  function alterarDetalheAnamnese(campo, valor) {
    setAnamnese((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function interpretarRespostaHistorico(valor) {
    const texto = String(valor || "").trim();

    if (/^sim\b/i.test(texto)) {
      return {
        resposta: "S",
        detalhe: texto.replace(/^sim\s*,?\s*/i, ""),
      };
    }

    return { resposta: "N", detalhe: "" };
  }

  function montarRespostaHistorico(resposta, detalhe = "") {
    if (resposta !== "S") {
      return "Não";
    }

    const textoDetalhe = detalhe.trim();
    return textoDetalhe ? `Sim, ${textoDetalhe}` : "Sim";
  }

  function converterHistoricoParaAnamnese(data) {
    const cirurgia = interpretarRespostaHistorico(data.cirurgia);
    const remedio = interpretarRespostaHistorico(data.remedio);
    const anticoncepcional = interpretarRespostaHistorico(data.anticoncepcional);
    const alergia = interpretarRespostaHistorico(data.alergiaMedicamento);
    const tratamento = interpretarRespostaHistorico(data.tratamentoMedico);
    const pressao = interpretarRespostaHistorico(data.pressaoArterial);
    const outro = interpretarRespostaHistorico(data.outroProblema);

    return {
      ...ANAMNESE_INICIAL,
      cirurgia: cirurgia.resposta,
      cirurgiaQual: cirurgia.detalhe,
      remedio: remedio.resposta,
      remedioQual: remedio.detalhe,
      anticoncepcional: anticoncepcional.resposta,
      anticoncepcionalQual: anticoncepcional.detalhe,
      alergiaMedicamento: alergia.resposta,
      alergiaMedicamentoQual: alergia.detalhe,
      tratamento: tratamento.resposta,
      tratamentoQual: tratamento.detalhe,
      pressao: pressao.resposta,
      pressaoQual: pressao.detalhe,
      outro: outro.resposta,
      outroQual: outro.detalhe,
      gestante: interpretarRespostaHistorico(data.estaGestante).resposta,
      rins: interpretarRespostaHistorico(data.problemaRinsFigado).resposta,
      fumante: interpretarRespostaHistorico(data.fumante).resposta,
      hepatite: interpretarRespostaHistorico(data.hepatite).resposta,
      diabetes: interpretarRespostaHistorico(data.diabetes).resposta,
      asma: interpretarRespostaHistorico(data.asma).resposta,
      cardiacos: interpretarRespostaHistorico(data.problemaCardiaco).resposta,
      convulsao: interpretarRespostaHistorico(data.convulsao).resposta,
      tontura: interpretarRespostaHistorico(data.tontura).resposta,
    };
  }

  async function buscarFichaMedica(idClienteSelecionado) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/fichas-medicas/${idClienteSelecionado}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 404) {
        setAnamnese({ ...ANAMNESE_INICIAL });
        return;
      }

      if (!response.ok) {
        throw new Error("Não foi possível carregar a ficha médica.");
      }

      const data = await response.json();
      setAnamnese(converterHistoricoParaAnamnese(data));
    } catch (error) {
      console.error("Erro ao buscar ficha médica:", error);
      setAnamnese({ ...ANAMNESE_INICIAL });
    }
  }

  async function salvarFichaMedica() {
    if (!idCliente) {
      alert("Selecione ou salve um cliente antes de salvar a ficha médica.");
      return;
    }

    const token = localStorage.getItem("token");
    const historico = {
      idCliente: Number(idCliente),
      cirurgia: montarRespostaHistorico(anamnese.cirurgia, anamnese.cirurgiaQual),
      remedio: montarRespostaHistorico(anamnese.remedio, anamnese.remedioQual),
      anticoncepcional: montarRespostaHistorico(
        anamnese.anticoncepcional,
        anamnese.anticoncepcionalQual
      ),
      alergiaMedicamento: montarRespostaHistorico(
        anamnese.alergiaMedicamento,
        anamnese.alergiaMedicamentoQual
      ),
      tratamentoMedico: montarRespostaHistorico(
        anamnese.tratamento,
        anamnese.tratamentoQual
      ),
      pressaoArterial: montarRespostaHistorico(anamnese.pressao, anamnese.pressaoQual),
      outroProblema: montarRespostaHistorico(anamnese.outro, anamnese.outroQual),
      estaGestante: montarRespostaHistorico(anamnese.gestante),
      problemaRinsFigado: montarRespostaHistorico(anamnese.rins),
      fumante: montarRespostaHistorico(anamnese.fumante),
      hepatite: montarRespostaHistorico(anamnese.hepatite),
      diabetes: montarRespostaHistorico(anamnese.diabetes),
      asma: montarRespostaHistorico(anamnese.asma),
      problemaCardiaco: montarRespostaHistorico(anamnese.cardiacos),
      convulsao: montarRespostaHistorico(anamnese.convulsao),
      tontura: montarRespostaHistorico(anamnese.tontura),
    };

    const campoMuitoLongo = Object.values(historico).some(
      (valor) => typeof valor === "string" && valor.length > 45
    );

    if (campoMuitoLongo) {
      alert("As descrições da ficha médica devem ter no máximo 40 caracteres.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/fichas-medicas/${idCliente}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(historico),
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível salvar a ficha médica.");
      }

      const fichaSalva = await response.json();
      setAnamnese(converterHistoricoParaAnamnese(fichaSalva));
      alert("Ficha médica salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar ficha médica:", error);
      alert("Erro ao salvar a ficha médica.");
    }
  }

  async function imprimirFichaMedica() {
    if (!idCliente) {
      alert("Selecione ou salve um cliente antes de imprimir a ficha médica.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/relatorios/fichamedica/pdf?id_param=${encodeURIComponent(
          idCliente
        )}&token=${encodeURIComponent(token)}`,
        {
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível gerar a ficha médica para impressão.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao imprimir ficha médica:", error);
      alert("Erro ao imprimir a ficha médica.");
    }
  }

  const estiloBotaoAcao = {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#c97b1d",
    color: "#fff",
    cursor: "pointer",
    fontSize: "18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
  };  

  const estiloBotaoInativar = {
    ...estiloBotaoAcao,
    backgroundColor: "#9b2c2c",
  };

  function handleContatoChange(e) {
    const { name, value } = e.target;

    setNovoContato((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function adicionarContato() {
    if (!idCliente) {
      alert("Selecione ou salve um cliente antes de adicionar o contato.");
      return;
    }

    if (!novoContato.valor.trim()) {
      alert("Informe o valor do contato.");
      return;
    }

    const token = localStorage.getItem("token");
    const ehTelefone = novoContato.tipo === "Telefone";
    const url = ehTelefone
      ? "http://localhost:8080/telefones"
      : "http://localhost:8080/emails";
    const body = ehTelefone
      ? {
          idCliente: Number(idCliente),
          foneCliente: novoContato.valor.trim(),
          tipofoneCliente: novoContato.tipo,
          descObsCliente: novoContato.descricao.trim(),
        }
      : {
          idCliente: Number(idCliente),
          emailCliente: novoContato.valor.trim(),
          tipoEmailCliente: novoContato.tipo,
          descObsCliente: novoContato.descricao.trim(),
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Não foi possível adicionar o contato.");
      }

      await buscarContatos(idCliente);
      setNovoContato({
        tipo: "Telefone",
        valor: "",
        descricao: "",
      });
      alert("Contato adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar contato:", error);
      alert("Erro ao adicionar o contato.");
    }
  }

  async function editarContato(contato) {
    const valorEditado = window.prompt("Edite o valor do contato:", contato.valor);

    if (valorEditado === null) {
      return;
    }

    if (!valorEditado.trim()) {
      alert("Informe o valor do contato.");
      return;
    }

    const descricaoEditada = window.prompt(
      "Edite a descrição / observação:",
      contato.descricao || ""
    );

    if (descricaoEditada === null) {
      return;
    }

    if (!contato.origem || !contato.idRegistro) {
      setContatos((prev) =>
        prev.map((item) =>
          item.id === contato.id
            ? { ...item, valor: valorEditado.trim(), descricao: descricaoEditada.trim() }
            : item
        )
      );
      return;
    }

    const token = localStorage.getItem("token");
    const ehTelefone = contato.origem === "telefone";
    const url = ehTelefone
      ? `http://localhost:8080/telefones/${contato.idRegistro}`
      : `http://localhost:8080/emails/${contato.idRegistro}`;
    const body = ehTelefone
      ? {
          idtelefone: contato.idRegistro,
          idCliente: Number(idCliente),
          foneCliente: valorEditado.trim(),
          tipofoneCliente: contato.tipo,
          descObsCliente: descricaoEditada.trim(),
          dataCadFoneCliente: contato.dataCadastro || null,
        }
      : {
          idemail: contato.idRegistro,
          idCliente: Number(idCliente),
          emailCliente: valorEditado.trim(),
          tipoEmailCliente: contato.tipo,
          descObsCliente: descricaoEditada.trim(),
          dataCadEmail: contato.dataCadastro || null,
        };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Não foi possível atualizar o contato.");
      }

      await buscarContatos(idCliente);
      alert("Contato atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar contato:", error);
      alert("Erro ao atualizar o contato.");
    }
  }

  async function excluirContato(contato) {
    const confirmou = window.confirm(`Deseja realmente excluir o contato ${contato.valor}?`);

    if (!confirmou) {
      return;
    }

    if (!contato.origem || !contato.idRegistro) {
      setContatos((prev) => prev.filter((item) => item.id !== contato.id));
      return;
    }

    const token = localStorage.getItem("token");
    const recurso = contato.origem === "telefone" ? "telefones" : "emails";

    try {
      const response = await fetch(
        `http://localhost:8080/${recurso}/${contato.idRegistro}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível excluir o contato.");
      }

      setContatos((prev) => prev.filter((item) => item.id !== contato.id));
      alert("Contato excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      alert("Erro ao excluir o contato.");
    }
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
              <div className="form-linha" style={{ marginBottom: "20px" }}>
                <div className="form-grupo nome">
                  <label>Buscar cliente</label>
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setBusca(valor);
                      buscarClientes(valor);
                    }}
                    placeholder="Digite o nome do cliente"
                  />
                </div>
              </div>

              {lista.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Código</th>
                        <th style={{ textAlign: "left" }}>Nome</th>
                        <th style={{ textAlign: "left" }}>CPF</th>
                      </tr>
                    </thead>

                    <tbody>
                      {lista.map((cliente) => (
                        <tr
                          key={cliente.idCliente}
                          onClick={() => {
                            selecionar(cliente);
                            setLista([]);
                            setBusca(cliente.nomeCliente);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{cliente.idCliente}</td>
                          <td>{cliente.nomeCliente}</td>
                          <td>{cliente.cpfCliente}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

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
                  <select
                    value={sexoCliente}
                    onChange={(e) => setSexoCliente(e.target.value)}
                  >
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
              <div style={{ marginTop: "24px" }}>
                <button type="button" style={estiloBotaoAcao} title="Salvar dados básicos" onClick={salvarCliente}>
                  <FaSave />
                </button>

                <button type="button" style={estiloBotaoInativar} title="Inativar cliente">
                  <FaBan />
                </button>
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
              <div style={{ marginTop: "24px" }}>
                <button type="button" style={estiloBotaoAcao} title="Salvar dados endereço" onClick={salvarEndereco}>
                  <FaSave />
                </button>
              </div>
            </>
          )}

          {abaAtiva === "contatos" && (
            <>
              <h3 style={{ marginTop: "28px", marginBottom: "16px" }}>
                Adicionar novo contato
              </h3>

              <div className="form-linha">
                <div className="form-grupo" style={{ width: "220px" }}>
                  <label>Tipo</label>
                  <select
                    name="tipo"
                    value={novoContato.tipo}
                    onChange={handleContatoChange}
                  >
                    <option value="Telefone">Telefone</option>
                    <option value="E-mail">E-mail</option>
                  </select>
                </div>

                <div className="form-grupo" style={{ width: "320px" }}>
                  <label>Valor</label>
                  <input
                    type="text"
                    name="valor"
                    value={novoContato.valor}
                    onChange={handleContatoChange}
                    placeholder={
                      novoContato.tipo === "Telefone"
                        ? "(00) 00000-0000"
                        : "cliente@email.com"
                    }
                  />
                </div>

                <div className="form-grupo" style={{ width: "420px" }}>
                  <label>Descrição / Observação</label>
                  <input
                    type="text"
                    name="descricao"
                    value={novoContato.descricao}
                    onChange={handleContatoChange}
                    placeholder="Ex.: WhatsApp, Trabalho, Principal..."
                  />
                </div>

                <div className="form-grupo" style={{ alignSelf: "end" }}>
                  <button
                    type="button"
                    onClick={adicionarContato}
                    style={{
                      padding: "13px 22px",
                      borderRadius: "9px",
                      border: "none",
                      backgroundColor: "#c97b1d",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaPlus />
                    Adicionar
                  </button>
                </div>
              </div>

              <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid #eee" }} />

              <h3 style={{ marginBottom: "16px" }}>Contatos cadastrados</h3>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #e5e5e5",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f7f7f7" }}>
                    <th style={thContato}>Tipo</th>
                    <th style={thContato}>Valor</th>
                    <th style={thContato}>Descrição / Observação</th>
                    <th style={thContato}>Data do cadastro</th>
                    <th style={thContato}>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {contatos.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: "18px", textAlign: "center" }}>
                        Nenhum contato cadastrado.
                      </td>
                    </tr>
                  ) : (
                    contatos.map((contato) => (
                      <tr key={contato.id}>
                        <td style={tdContato}>{contato.tipo}</td>
                        <td style={tdContato}>{contato.valor}</td>
                        <td style={tdContato}>{contato.descricao || "-"}</td>
                        <td style={tdContato}>{formatarData(contato.dataCadastro)}</td>
                        <td style={tdContato}>
                          <button
                            type="button"
                            title="Editar"
                            onClick={() => editarContato(contato)}
                            style={botaoTabela}
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            title="Excluir"
                            onClick={() => excluirContato(contato)}
                            style={{
                              ...botaoTabela,
                              color: "red",
                              borderColor: "#ffb3b3",
                              marginLeft: "8px",
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <p style={{ textAlign: "center", marginTop: "22px", color: "#666" }}>
                Todos os contatos cadastrados serão utilizados para comunicação com o cliente.
              </p>
            </>
          )}

          {abaAtiva === "ficha" && (<>
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
                          value={anamnese.cirurgiaQual}
                          onChange={(e) => alterarDetalheAnamnese("cirurgiaQual", e.target.value)}
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
                          value={anamnese.remedioQual}
                          onChange={(e) => alterarDetalheAnamnese("remedioQual", e.target.value)}
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
                          value={anamnese.anticoncepcionalQual}
                          onChange={(e) => alterarDetalheAnamnese("anticoncepcionalQual", e.target.value)}
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
                          value={anamnese.alergiaMedicamentoQual}
                          onChange={(e) => alterarDetalheAnamnese("alergiaMedicamentoQual", e.target.value)}
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
                          value={anamnese.tratamentoQual}
                          onChange={(e) => alterarDetalheAnamnese("tratamentoQual", e.target.value)}
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
                          value={anamnese.pressaoQual}
                          onChange={(e) => alterarDetalheAnamnese("pressaoQual", e.target.value)}
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
                          value={anamnese.outroQual}
                          onChange={(e) => alterarDetalheAnamnese("outroQual", e.target.value)}
                        />
                      </>
                    )}

                  </div>

                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    type="button"
                    className="botao-acao"
                    title="Salvar ficha médica"
                    onClick={salvarFichaMedica}
                  >
                    <FaSave />
                  </button>
                  <button
                    type="button"
                    className="botao-acao"
                    title="Imprimir ficha médica"
                    onClick={imprimirFichaMedica}
                    disabled={!idCliente}
                    style={{
                      opacity: idCliente ? 1 : 0.5,
                      cursor: idCliente ? "pointer" : "not-allowed",
                    }}
                  >
                    <FaPrint />
                  </button>
                </div>
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

const thContato = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  fontWeight: "700",
};

const tdContato = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const botaoTabela = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  cursor: "pointer",
};
