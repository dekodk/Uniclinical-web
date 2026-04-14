import { useEffect, useState } from "react";
import "./Cadastros.css";

export default function Agenda() {
  const hoje = new Date().toISOString().split("T")[0];

  const [dataFiltro, setDataFiltro] = useState(hoje);
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarAgendamentos(dataFiltro);
  }, [dataFiltro]);

  async function carregarAgendamentos(data) {
    try {
      setCarregando(true);

      const response = await fetch(
        `http://localhost:8080/agendamentos?data=${data}`
      );

      const dataJson = await response.json();

      const listaOrdenada = [...dataJson].sort((a, b) =>
        (a.hora || "").localeCompare(b.hora || "")
      );

      setAgendamentos(listaOrdenada);
    } catch (error) {
      console.error("Erro ao carregar agenda:", error);
      setAgendamentos([]);
    } finally {
      setCarregando(false);
    }
  }

  function formatarHora(hora) {
    if (!hora) return "";
    return hora.slice(0, 5);
  }

  function formatarDataBR(data) {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <div className="cadastros-page">
      <div className="cadastros-topo">
        <h1>Agenda do Dia</h1>
      </div>

      <div className="cadastros-conteudo">
        <div className="cadastros-card">
          <div
            className="form-linha"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div className="form-grupo" style={{ width: "200px" }}>
              <label>Data</label>
              <input
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => carregarAgendamentos(dataFiltro)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#c97b1d",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                Atualizar
              </button>
            </div>

            <div style={{ marginLeft: "auto", fontWeight: "600" }}>
              {formatarDataBR(dataFiltro)}
            </div>
          </div>

          {carregando ? (
            <p>Carregando agenda...</p>
          ) : agendamentos.length === 0 ? (
            <div
              style={{
                padding: "20px",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                backgroundColor: "#fafafa",
              }}
            >
              Nenhum agendamento para esta data.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              {agendamentos.map((ag) => (
                <div
                  key={ag.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "110px 1fr",
                    border: "1px solid #e3e3e3",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff7ec",
                      color: "#c97b1d",
                      fontWeight: "700",
                      fontSize: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "18px 10px",
                      borderRight: "1px solid #eee",
                    }}
                  >
                    {formatarHora(ag.hora)}
                  </div>

                  <div style={{ padding: "16px 18px" }}>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "8px",
                        color: "#2f2f2f",
                      }}
                    >
                      {ag.clienteNome}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(140px, 1fr))",
                        gap: "10px",
                        fontSize: "14px",
                        color: "#444",
                      }}
                    >
                      <div>
                        <strong>Procedimento:</strong>
                        <br />
                        {ag.procedimentoNome || "-"}
                      </div>

                      <div>
                        <strong>Colaborador:</strong>
                        <br />
                        {ag.colaboradorNome || "-"}
                      </div>

                      <div>
                        <strong>Sala:</strong>
                        <br />
                        {ag.sala || "-"}
                      </div>
                    </div>

                    {ag.observacao && (
                      <div
                        style={{
                          marginTop: "12px",
                          paddingTop: "10px",
                          borderTop: "1px solid #f0f0f0",
                          fontSize: "14px",
                          color: "#555",
                        }}
                      >
                        <strong>Observação:</strong> {ag.observacao}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}