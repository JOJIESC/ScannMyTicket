import React from 'react'
import Ticket from '@/components/molecules/Ticket/Ticket'

function MyTickets() {
  return (
    <div>
      <div>
      <div>
        <div className="flex flex-row items-center p-10">
          <img className="h-10" src="/img/codeQr.png" alt="" />
          <h1 className="text-4xl font-bold text-center ml-4 text-black">
            My Tickets
          </h1>
        </div>
        <div className="flex space-x-6 p-10">
          <Ticket />
          <Ticket />
          <Ticket />
          <Ticket />
          <Ticket />
        </div>
      </div>
    </div>
    </div>
  )
}

export default MyTickets
