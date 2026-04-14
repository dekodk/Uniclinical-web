import { useState } from "react";

export default function BuscaAutocomplete({
  label,
  lista,
  campoBusca = "nome",
  placeholder = "Digite...",
  onSelect,
  valorSelecionado = "",
  width = "320px",
}) {
  const [texto, setTexto] = useState(valorSelecionado);
  const [mostrarLista, setMostrarLista] = useState(false);

  const listaFiltrada = lista.filter((item) =>
    item[campoBusca]
      ?.toLowerCase()
      .includes(texto.toLowerCase())
  );

  function selecionarItem(item) {
    setTexto(item[campoBusca]);
    setMostrarLista(false);
    onSelect(item);
  }

  return (
    <div
      className="form-grupo"
      style={{ width, position: "relative" }}
    >
      <label>{label}</label>

      <input
        type="text"
        value={texto}
        placeholder={placeholder}
        onChange={(e) => {
          setTexto(e.target.value);
          setMostrarLista(true);
        }}
        onFocus={() => setMostrarLista(true)}
      />

      {mostrarLista && texto && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxHeight: "180px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {listaFiltrada.length > 0 ? (
            listaFiltrada.map((item) => (
              <div
                key={item.id}
                onClick={() => selecionarItem(item)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {item[campoBusca]}
              </div>
            ))
          ) : (
            <div style={{ padding: "10px" }}>
              Nenhum resultado
            </div>
          )}
        </div>
      )}
    </div>
  );
}