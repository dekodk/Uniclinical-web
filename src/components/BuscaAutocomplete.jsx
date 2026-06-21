import { useEffect, useState } from "react";

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

  useEffect(() => {
    setTexto(valorSelecionado);
  }, [valorSelecionado]);

  const getItemValue = (item) => {
    return (
      item[campoBusca] ??
      item.nome ??
      item.nomeCliente ??
      item.campoBusca ??
      ""
    );
  };

  const listaFiltrada = lista.filter((item) => {
    const valor = String(getItemValue(item) ?? "");
    return valor.toLowerCase().includes(texto.toLowerCase());
  });

  function selecionarItem(item) {
    const valor = getItemValue(item);
    setTexto(valor);
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
            listaFiltrada.map((item, index) => (
              <div
                key={item.id ?? item.idCliente ?? item.codigo ?? index}
                onClick={() => selecionarItem(item)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {getItemValue(item)}
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