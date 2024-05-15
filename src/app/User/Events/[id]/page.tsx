import axios from "axios"
import NavbarUser from "@/components/molecules/NavbarUser/NavbarUser"
import Image from "next/image"

async function loadEvents(eventID: number) {
    //verificar el puerto del servidor 
    const { data } = await axios.get(`http://localhost:3000/api/events/${eventID}`)
    return data
}
async function EventPage({ params }: { params: any }) {
    const evento = await loadEvents(params.id)
    console.log(evento)
    return (
        <div>
            <main className="flex justify-around w-full h-full py-28 px-20 ">
                <div className="flex flex-col gap-8">
                    <Image className="h-80 w-[650px] rounded-lg" src={`/img/portadaEventos/${evento.id}.png`} alt={evento.title} width={500} height={200} />
                    <h3 className="font-bold text-2xl">Descripción: </h3>
                    <p>{evento.description}</p>
                </div>
                <div className="flex flex-col max-w-[340px] gap-8">
                    <div>

                        <h1 className="flex font-bold text-4xl">
                            Evento:
                        </h1>
                        <h1 className="flex font-bold text-4xl">
                            {evento.title}
                        </h1>
                    </div>
                    <section className="flex flex-col gap-5 text-2xl">
                        <h2 className="flex items-center font-bold">
                            info
                            <span className="material-symbols-outlined font-bold">
                                info
                            </span>
                        </h2>
                        <div>

                            <p className="font-bold">Fecha de inicio: </p>
                            <p>{evento.start}</p>
                        </div>
                        <div>

                            <p className="font-bold">Fecha de conclusión: </p>
                            <p >{evento.end}</p>
                        </div>
                    </section>

                    <div className="flex justify-center">

                        <button className="py-6 px-28 rounded-lg bg-customGreen">Suscribirse</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default EventPage
