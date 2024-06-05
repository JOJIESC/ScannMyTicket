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
      <h2 className="text-lg font-bold text-center text-black mb-2">
        {event.title}
      </h2>
      <img src={event.image_url} alt={event.title} className="w-full h-40 object-cover rounded-lg mb-2" />
      <div className="mt-4 space-y-4">
        <p className=" font-bold text-gray-600 text-sm text">
          Fecha Inicio:<p>{new Date(event.start).toLocaleString()}</p>
        </p>
        <p className="font-bold text-gray-600 text-sm text">
          Fecha Conclusión:
          <p> {new Date(event.end).toLocaleString()}</p>
        </p>
        <div className="flex justify-center">
          <Link href={`/User/MisTickets/${event.id}`} className="flex justify-center bg-white rounded text-black font-bold p-2 w-full hover:bg-customGreen
          transition ease-in-out delay-100hover:-translate-y-1 hover:scale-110 duration-300">
              Generar
          </Link>
        </div>
      </div>
    </div>
  );
};



export default Ticket;
