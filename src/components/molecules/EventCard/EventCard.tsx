import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
    title: string;
    event_id: number;
    start: Date;
    end: Date;
    startTime: string;
    endTime: string;
    location: string;
    image_url: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, event_id, start, end,startTime,endTime,location,image_url }) => {
    return (
        <Link href={`./Events/${event_id}`} className="w-[30rem] flex flex-col items-center bg-customGray border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100">
            <div className='flex h-full '>
                {/*La imagen se define por el id del evento */}
                <Image width={200} height={300} className="object-cover w-full rounded-t-lg h-full md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={image_url} alt={title}/>
            </div>
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{title}</h5>
                <p className='font-normal text-gray-700'>Starts: {start.toString()}</p>
                <p>Start time: {startTime}</p>
                <p className='font-normal text-gray-700'>Ends at: {end.toString()}</p>
                <p>End time: {endTime}</p>
                <p>Location: {location}</p>
            </div>
        </Link>
    );
};

export default EventCard;