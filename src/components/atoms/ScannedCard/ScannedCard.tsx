import React from 'react'

type ScannedCardProps = {
    username: string;
    titleEvent: string;
    fechaEscaneo: string;
    horaEscaneo: string;
};

function ScannedCard({ username, titleEvent, fechaEscaneo, horaEscaneo }: ScannedCardProps) {
    return (
        <div className='w-full border-black border rounded-lg p-5 relative'>
            <span className="material-symbols-outlined absolute top-2 right-2">
                qr_code
            </span>
            <h2 className='font-bold text-2xl'>{username}</h2>
            <h2 className='font-bold text-xl'>{titleEvent}</h2>
            <p>Fecha de escaneo: {fechaEscaneo}</p>
            <p>Hora de escaneo: {horaEscaneo}</p>
        </div>
    );
}

export default ScannedCard
