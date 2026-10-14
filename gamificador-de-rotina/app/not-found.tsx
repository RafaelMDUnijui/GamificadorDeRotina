import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-blue-700 dark:text-blue-300">
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
          className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
