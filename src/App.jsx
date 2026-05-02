import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login";
import MenuPrincipal from "./pages/MenuPrincipal";

function App() {
  const tokenSalvo = localStorage.getItem("token");

  const [logado, setLogado] = useState(
    localStorage.getItem("logado") === "true" && tokenSalvo
  );

  function sair() {
    localStorage.removeItem("logado");
    localStorage.removeItem("token");
    setLogado(false);
  }

  function obterUsuarioLogado() {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    return jwtDecode(token);
  }

  if (!logado) {
    return <Login onLogin={() => setLogado(true)} />;
  }

  return (
    <MenuPrincipal
      onLogout={sair}
      usuarioLogado={obterUsuarioLogado()}
    />
  );
}

export default App;