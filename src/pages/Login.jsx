import { useState } from "react";
import "./Login.css";
import logoClinica from "../assets/Saúde e estética_logo.jpg";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  function fazerLogin() {
    alert(`Usuário: ${usuario}`);
  }

 return (
  <div className="login-container">
    <img
      src={logoClinica}
      alt="Logo da clínica"
      className="logo"
    />

    <div className="login-box">
      <h1 className="login-title">Login!</h1>

      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="input-login"
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="input-login"
      />

      <button
        onClick={fazerLogin}
        className="botao-login"
      >
        Login
      </button>
    </div>
  </div>
);
}