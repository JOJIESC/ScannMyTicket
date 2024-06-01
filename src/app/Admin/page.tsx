'use client';
import React from "react";
import Avatar from "@/components/atoms/Avatar/Avatar";
import EventCounter from "@/components/atoms/EventCounter/EventCounter";

export default function Admin() {
    return (
        <div className="p-10">
            <div className="ml-16 flex jutify-between gap-16 items-center mb-8">
                <Avatar width={100} /> 
                <div>
                <h1 className="font-bold text-5xl">Dashboard</h1>
                <p className="text-base text-gray-600">Bienvenido</p>
                </div>
                <input className="flex-grow bg-customGray h-10 rounded-md p-2 shadow" type="text" placeholder="Busca un evento" />
            </div>
            <div className="flex gap-4 mb-2">
                <EventCounter count={55256} label="Eventos generados" />
                <EventCounter count={55256} label="Eventos generados" />
                <EventCounter count={55256} label="Eventos generados" />
                <EventCounter count={55256} label="Eventos generados" />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full h-64 mb-2">
                Aún no sabemos como reemplazar esta parte de estadisticas, se me ocurría poner la tarjeta del evento más concurrido del administrador
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full h-40">
                <h2 className="font-bold mb-2 font-2xl">Organizers:</h2>
               <div className="ml-8 -space-x-8 flex items-center">
               <Avatar width={80} />
               <Avatar width={80} />
               <Avatar width={80} />
               <Avatar width={80} />
               <Avatar width={80} />
               </div>
            </div>
        </div>
    );

}
