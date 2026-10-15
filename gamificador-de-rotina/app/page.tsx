
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, saveUser, setSession } from "@/lib/auth";
import { FlameIcon } from "@/components/Icon";

type Mode = "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter(); 
  const [v, setV] = useState({
    name: "",
    email: "",
    password: "",
  confirm: "",
});

const trocar = (novoMode: Mode) => {
  setMode(novoMode);
  setErrors({});
};

  
function validar() {
  const er: Record<string, string> = {};

  if (mode === "register" && v.name.trim().length < 2) {
    er.name = "Informe um nome com pelo menos 2 caracteres.";
  }

  if (!/^\S+@\S+\.\S+$/.test(v.email)) {
    er.email = "Informe um e-mail válido.";
  }

  if (v.password.length < 6) {
    er.password = "A senha precisa ter pelo menos 6 caracteres.";
  }

  if (mode === "register" && v.confirm !== v.password) {
  er.confirm = "As senhas não conferem.";
}

  return er;
}


function submit(e: React.SubmitEvent<HTMLFormElement>) {
  e.preventDefault();

  const er = validar();

  if (Object.keys(er).length > 0) {
    setErrors(er);
    return;
  }

  // 2. Procura o usuário cadastrado
  const usuarios = getUsers();
  const email = v.email.trim().toLowerCase();

  const usuarioExistente = usuarios.find(
    (usuario) => usuario.email.toLowerCase() === email
  );

  if (mode === "register") {
    if (usuarioExistente) {
      setErrors({ email: "Este e-mail já está cadastrado." });
      return;
    }

    const novoUsuario = {
      name: v.name.trim(),
      email,
      password: v.password,
    };

    saveUser(novoUsuario);
    setSession(novoUsuario);
  }

  else {
    if (!usuarioExistente || usuarioExistente.password !== v.password) {
      setErrors({ password: "E-mail ou senha incorretos." });
      return;
    }

    setSession(usuarioExistente);
  }

  // 5. Login/cadastro concluído
  setErrors({});
  router.push("/tarefas");
}



  return (
    <div className="auth">
      <div className="card auth-card">
        <div className="auth-head">
          <span className="brand-mark brand-mark-lg">
            <FlameIcon size={26} />
          </span>
          <h1>AMANHÃ EU FAÇO</h1>
          <p className="sub">Organize suas tarefas e mantenha sua sequência!</p>
        </div>

        <div className="seg" role="group" aria-label="Acesso">
          <button
            type="button"
            aria-pressed={mode === "login"}
            onClick={() => trocar("login")}
          >
            Já tenho conta
          </button>

          <button
            type="button"
            aria-pressed={mode === "register"}
            onClick={() => trocar("register")}
          >
            Criar conta
          </button>
        </div>

        <form noValidate onSubmit={submit}>
          {mode === "register" && (
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                value={v.name}
                onChange={(e) => setV({ ...v, name: e.target.value })}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="err">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={v.email}
              onChange={(e) => setV({ ...v, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="err">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={v.password}
              onChange={(e) => setV({ ...v, password: e.target.value })}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="err">
                {errors.password}
              </p>
            )}
          </div>

          {mode === "register" && (
            <div className="field">
              <label htmlFor="confirm">Confirmar senha</label>
              <input
                id="confirm"
                type="password"
                value={v.confirm}
                onChange={(e) => setV({ ...v, confirm: e.target.value })}
                aria-invalid={!!errors.confirm}
                aria-describedby={errors.confirm ? "confirm-error" : undefined}
                autoComplete="new-password"
              />
              {errors.confirm && (
                <p id="confirm-error" role="alert" className="err">
                  {errors.confirm}
                </p>
              )}
            </div>
          )}

          <button type="submit" className="btn block">
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
