"use client";
import React, { useState, useEffect } from "react";
import Ticket from "@/components/molecules/Ticket/Ticket";

interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  image_url: string; // Añadir la URL de la imagen
}

function MyTickets() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setError("Unexpected response from server");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (events.length === 0) {
    return <div>No subscriptions found.</div>;
  }

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
          <div className="flex flex-wrap space-x-6 p-10">
            {events.map((event) => (
              <Ticket key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTickets;
