
"use client";

import { useState } from "react";

type Mode = "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [v, setV] = useState({
    name: "",
    email: "",
    password: "",
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

  return er;
}

function submit(e: React.SubmitEvent<HTMLFormElement>) {
  e.preventDefault();

  const er = validar();
  setErrors(er);

  if (Object.keys(er).length > 0) {
    return;
  }
}


  return (
    <main
      id="conteudo"
      className="flex min-h-screen items-center justify-center bg-gray-100 p-4"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Rotina
        </h1>

        <p className="mb-6 text-gray-600">
          Organize suas tarefas e mantenha sua sequência!
        </p>

        <div className="mb-6 flex gap-2" role="group" aria-label="Acesso">
          <button
            type="button"
            aria-pressed={mode === "login"}
            onClick={() => trocar("login")}
            className="flex-1 rounded-lg bg-teal-700 p-3 text-white"
          >
            Entrar
          </button>

          <button
            type="button"
            aria-pressed={mode === "register"}
            onClick={() => trocar("register")}
            className="flex-1 rounded-lg bg-teal-700 p-3 text-white"
          >
            Criar conta
          </button>
        </div>

        <form noValidate onSubmit={submit}>
          {mode === "register" && (
            <div className="mb-4">
              <label htmlFor="name" className="mb-1 block text-gray-900">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={v.name}
                onChange={(e) => setV({ ...v, name: e.target.value })}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="w-full rounded-lg border border-gray-400 p-3 text-gray-900"
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-gray-900">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={v.email}
              onChange={(e) => setV({ ...v, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-lg border border-gray-400 p-3 text-gray-900"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-700">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1 block text-gray-900">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={v.password}
              onChange={(e) => setV({ ...v, password: e.target.value })}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full rounded-lg border border-gray-400 p-3 text-gray-900"
            />
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-sm text-red-700">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-teal-700 p-3 font-bold text-white"
          >
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </div>
    </main>
  );
}
