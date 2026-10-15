import Link from "next/link";

export default function NotFound() {
  return (
    <main id="conteudo" className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-[var(--accent)]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold">
          Página não encontrada
        </h2>

        <p className="mt-4 text-zinc-600 dark:text-zinc-300">
          A página que você está procurando não existe ou foi removida.
        </p>

        <Link
          href="/"
          className="btn mt-6"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
