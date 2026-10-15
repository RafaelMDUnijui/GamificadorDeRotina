"use client";
import { FlameIcon } from "./Icon";

type HeaderProps = {
  nomeUsuario: string;
  onLogout: () => void;
};

export default function Header({ nomeUsuario, onLogout }: HeaderProps) {
  const inicial = nomeUsuario.trim().charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-in">
        <div className="brand">
          <span className="brand-mark">
            <FlameIcon size={18} />
          </span>
          <span className="brand-name">AMANHÃ EU FAÇO</span>
        </div>

        <div className="topbar-user">
          {inicial && (
            <span className="avatar" aria-hidden="true">
              {inicial}
            </span>
          )}
          <p className="hello">
            Olá, <strong>{nomeUsuario}</strong>!
          </p>
          <button type="button" onClick={onLogout} className="btn ghost sm">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
