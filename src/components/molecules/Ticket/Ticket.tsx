import React from 'react';

interface TicketProps {

}

const Ticket: React.FC = () => {
    return (
      <div className="bg-customGray shadow rounded p-4 h-auto w-60 flex flex-col">
        <h2 className="text-lg font-bold text-center text-black">Evento</h2>
        <img src="/img/qrExample.png" alt="" />
        <div className="mt-4 space-y-4">
          <p className="text-gray-600 text-sm text">
            Fecha Inicio: 22.Feb.2024 13:00h
          </p>
          <p className="text-gray-600 text-sm text">
            Fecha Conclusión: 22.Feb.2024 13:00h
          </p>
          <div className="flex justify-center">
            <button className="bg-white rounded text-black font-bold p-2">
              Generar{" "}
            </button>
          </div>
        </div>
      </div>
    );
}

export default Ticket;