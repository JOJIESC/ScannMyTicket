import React from 'react'
import { Event } from '@/types'

function OperatorEventCard({id,title,description,location,start,end,startTime,endTime}: Event) {
    return (

        <a href={`./Operator/${id}`} className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{title}</h5>
            <p className="font-normal text-gray-700 ">{description}</p>
            <p>{location}</p>
            <p>{start.toString()}</p>
            <p>{end.toString()}</p>
            <p>{startTime}</p>
            <p>{endTime}</p>
        </a>
    )
}

export default OperatorEventCard
