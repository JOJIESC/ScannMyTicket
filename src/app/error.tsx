'use client';

export default function GlobalError({ error }: { error: unknown }) {
  console.error(error);
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">Ocurrió un error</h1>
        <p className="text-gray-600">Intenta recargar o vuelve más tarde.</p>
      </div>
    </main>
  );
}
