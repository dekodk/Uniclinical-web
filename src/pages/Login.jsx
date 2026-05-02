import { useState } from "react";
import "./Login.css";
import logoClinica from "../assets/Saúde e estética_logo.jpg";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin() {
  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idLogin: usuario,
        idSenha: senha
      })
    });

    const token = await response.text();

    // 🔥 se login falhar
    if (!response.ok || token === "ERRO" || !token) {
      alert("Usuário ou senha inválidos!");
      return;
    }

    // 🔥 sucesso
    localStorage.setItem("token", token);
    localStorage.setItem("logado", "true");

    onLogin();

  } catch (error) {
    console.error("Erro real:", error);
    alert("Erro ao conectar com o servidor.");
  }
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