'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold">Algo salió mal</h1>
        <p className="text-gray-600">Intenta recargar o volver atrás. Si persiste, avísanos.</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
