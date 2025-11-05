export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Página no encontrada</h1>
        <p className="text-gray-600">La ruta solicitada no existe o fue movida.</p>
        <a href="/" className="inline-block mt-4 underline">Volver al inicio</a>
      </div>
    </main>
  );
}
