import EventCard from "@/components/molecules/EventCard/EventCard"
import axios from "axios"

async function loadEvents(){
    //verificar el puerto del servidor 
    const {data} = await axios.get('http://localhost:3000/api/events/')
    return data
}

async function Events() {
    
   const events = await loadEvents()
  return (
    <main className="mx-12 my-3">
        <h1 className="text-black font-sans font-bold text-5xl my-10">Eventos</h1>
        <div className="flex flex-wrap gap-2 justify-center">
            {events.map((evento: { id: number; title: string; description: string; image_url: string; start:Date ; end: Date; startTime: string; endTime:string}) => {
                return (
                    <EventCard
                        key={evento.id}
                        title={evento.title}
                        event_id={evento.id}
                        start={evento.start}
                        end={evento.end}
                        startTime={evento.startTime}
                        endTime={evento.endTime}
                    />
                )
            })}
        </div>
    </main>
  )
}

export default Events
