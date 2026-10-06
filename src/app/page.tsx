export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-emerald-600">
          NutriSoft
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Sistema de Gestão Nutricional & Prescrição Clínica Inteligente
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Next.js 14 App Router
          </span>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Firebase SDK & Admin
          </span>
          <span className="inline-flex items-center rounded-md bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            TACO Database
          </span>
        </div>
      </div>
    </main>
  );
}
