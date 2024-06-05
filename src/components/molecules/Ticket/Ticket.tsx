import React from "react";
import Link from "next/link";

interface TicketProps {
  event: {
    id: number;
    title: string;
    description: string;
    start: string;
    end: string;
    image_url: string;
  };
}

const Ticket: React.FC<TicketProps> = ({ event }) => {
  return (
    <div className="bg-customGray shadow rounded p-4 h-auto w-60 flex flex-col">
      <h2 className="text-lg font-bold text-center text-black">
        {event.title}
      </h2>
      <img src={event.image_url} alt={event.title} className="w-full h-40 object-cover" />
      <div className="mt-4 space-y-4">
        <p className="text-gray-600 text-sm text">
          Fecha Inicio: {new Date(event.start).toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm text">
          Fecha Conclusión: {new Date(event.end).toLocaleString()}
        </p>
        <div className="flex justify-center">
          <Link href={`/User/MisTickets/${event.id}`}>
            <button className="bg-white rounded text-black font-bold p-2">
              Generar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
