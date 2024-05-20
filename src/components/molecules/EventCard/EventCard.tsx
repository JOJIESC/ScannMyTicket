import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
    title: string;
    description: string;
    image_url: string;
    event_id: number;
    start: string;
    end: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, description, image_url, event_id, start, end }) => {
    return (

        <Link href={`./Events/${event_id}`} className="w-1/2 flex flex-col items-center bg-customGray border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100">
            <div className='flex h-full '>
            <img className="object-cover w-full rounded-t-lg h-full md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={`/img/portadaEventos/${event_id}.png`} alt=""/>
            </div>
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{title}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">event ID : {event_id}</p>
                    <p className='font-normal text-gray-700'>Starts at: {start}</p>
                    <p className='font-normal text-gray-700'>Ends at: {end}</p>
            </div>
        </Link>

    );
};

export default EventCard;