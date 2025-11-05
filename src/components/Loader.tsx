'use client';

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-dvh w-full">
      <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50">
        <div role="status">Cargando…</div>
      </div>
    </div>
  );
}
