import React from "react";
import Link from "next/link";

interface TicketProps {
  event: {
    id: number;
    title: string;
    description?: string | null;
    start?: string | Date | null;
    end?: string | Date | null;
    image_url?: string | null | undefined;

    // ✓ Campos opcionales para reflejar el estado del ticket
    used_at?: string | Date | null;
    used_by_operator_email?: string | null;
  };
}

const fallbackImage = "https://picsum.photos/400/240?blur=2";

const safeImg = (src?: string | null) => {
  if (!src) return fallbackImage;
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  )
    return src;
  return fallbackImage;
};

const fmt = (v?: string | Date | null) =>
  v
    ? new Date(
        typeof v === "string" || v instanceof Date ? v : String(v)
      ).toLocaleString()
    : "—";

const Ticket: React.FC<TicketProps> = ({ event }) => {
  const isUsed = Boolean(event.used_at);
  const usedAtText = isUsed ? fmt(event.used_at) : null;

  return (
    <div className="relative bg-customGray shadow rounded p-4 h-auto w-60 flex flex-col overflow-hidden">
      {/* Etiqueta “USADO” */}
      {isUsed && (
        <div
          className="absolute top-2 right-[-40px] rotate-45 bg-red-600 text-white text-xs font-bold py-1 px-14 shadow"
          title={
            event.used_by_operator_email
              ? `Usado el ${usedAtText} por ${event.used_by_operator_email}`
              : `Usado el ${usedAtText}`
          }
        >
          USADO
        </div>
      )}

      <h2 className="text-lg font-bold text-center text-black mb-2">
        {event.title}
      </h2>

      <img
        src={safeImg(event.image_url)}
        alt={event.title}
        className="w-full h-40 object-cover rounded-lg mb-2"
      />

      <div className="mt-4 space-y-4">
        <p className="font-bold text-gray-600 text-sm">
          Fecha Inicio:
          <p>{fmt(event.start)}</p>
        </p>

        <p className="font-bold text-gray-600 text-sm">
          Fecha Conclusión:
          <p>{fmt(event.end)}</p>
        </p>

        {/* Si está usado, mostramos nota bajo las fechas */}
        {isUsed && (
          <p className="text-xs text-red-700 font-semibold leading-4">
            Este ticket ya fue utilizado
            {usedAtText ? ` el ${usedAtText}` : ""}.
          </p>
        )}

        <div className="flex justify-center">
          <Link
            href={`/User/MisTickets/${event.id}`}
            className={`flex justify-center rounded text-black font-bold p-2 w-full transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300
              ${isUsed ? "bg-gray-100 hover:bg-gray-200" : "bg-white hover:bg-customGreen"}`}
            title={isUsed ? "Ticket usado: aún puedes ver tu QR" : "Generar/ver QR"}
          >
            {isUsed ? "Ver QR" : "Generar QR"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
