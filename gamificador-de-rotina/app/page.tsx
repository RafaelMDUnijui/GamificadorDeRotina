
"use client";

import { useState } from "react";

type Mode = "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");

  const [v, setV] = useState({
    name: "",
    email: "",
    password: "",
  });

  const trocar = (novoMode: Mode) => {
    setMode(novoMode);
  };

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

        <form onSubmit={(e) => e.preventDefault()}>
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
                className="w-full rounded-lg border border-gray-400 p-3 text-gray-900"
              />
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
              className="w-full rounded-lg border border-gray-400 p-3 text-gray-900"
            />
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
              className="w-full rounded-lg border border-gray-400 p-3 text-gray-900"
            />
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
