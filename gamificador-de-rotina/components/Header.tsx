"use client";

type HeaderProps = {
  nomeUsuario: string;
  onLogout: () => void;
};

export default function Header({
  nomeUsuario,
  onLogout,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">

        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-2xl">
            🔥
          </span>
          <span className="text-lg font-bold">
            Gamificador de Rotina
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm">
            Olá, <strong>{nomeUsuario}</strong>!
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="min-h-11 rounded-lg bg-blue-700 px-5 py-2 font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Sair
          </button>
        </div>

      </div>
    </header>
  );
}
