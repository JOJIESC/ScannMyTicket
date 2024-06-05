'use client';
import React, { useState } from "react";
import Avatar from "@/components/atoms/Avatar/Avatar";
import EventCounter from "@/components/atoms/EventCounter/EventCounter";
import axios from "axios";
import { Event } from "@/types";

function Organizer() {
    // Datos del usuario
    const [user, setUser] = useState({
        username: "",
        avatar: "",
        id: ""
    });

    const getProfile = async () => {
        const response = await axios.get('/api/auth/PROFILE');
        setUser(response.data); // Ajuste para acceder al objeto correcto
        console.log(response.data);
    };

    // Esta función toma los datos del usuario y setea el usuario
    React.useEffect(() => {
        getProfile();
    }, []);

    console.log(user);

    // STATS ------------------------------
    const [numSubs, setNumSubs] = useState(0);
    const [numEvents, setNumEvents] = useState([{
        total_events: 0
    }]);
    const [myEvents, setmyEvents] = useState([{
        title: "",
        start: "",
        end: "",
        location: "",
        id: "",
        description: "",
        image_url: "",
        startTime: "",
        endTime: ""
    }]);
    const getNumSubs = async (userId: string) => {
        console.log(userId);
        const results = await axios.post('/api/organizers/countSubs', { user_id: userId });
        setNumSubs(results.data.total_subscriptions);
        return results.data.total_subs;
    };

    const getNumEvents = async (userId: string) => {
        console.log(userId);
        const results = await axios.post('/api/organizers/countMyEvents', { user_id: userId });
        setNumEvents(results.data);
        console.log(numEvents)
        return results.data;
    };

    const getMyEvents = async (userId: string) => {
        console.log(userId);
        const results = await axios.post('/api/organizers/getMyEvents', { user_id: userId });
        setmyEvents(results.data);
        return results.data;
    };

    React.useEffect(() => {
        console.log(user.id);
        if (user.id) {
            getNumSubs(user.id);
            getNumEvents(user.id);
            getMyEvents(user.id);
        }

    }, [user.id]);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredEvents, setFilteredEvents] = useState(myEvents);

    React.useEffect(() => {
        setFilteredEvents(
            myEvents.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        console.log(filteredEvents);
    }, [searchTerm, myEvents]);


    return (
        <div className="flex flex-col justify-center max-w-7xl gap-3">
            <div className="ml-16 flex justify-between gap-16 items-center mb-8">
                <Avatar avatarOption={user.avatar} width={100} />
                <div>
                    <h1 className="font-bold text-5xl">Dashboard</h1>
                    <p className="text-base text-gray-600">Bienvenido {user.username}</p>
                </div>
                <input className="flex-grow bg-customGray h-10 rounded-md p-2 shadow" type="text" placeholder="Busca un evento"
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-4 ">
                <EventCounter count={numSubs} label="Total de suscriptores" />
                <EventCounter count={numEvents[0].total_events} label="Total de mis eventos" />
            </div>


            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <h4 className="text-3xl font-bold mb-3">Mis eventos:</h4>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 bg-gray-50">
                                Título
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Empieza
                            </th>
                            <th scope="col" className="px-6 py-3 bg-gray-50">
                                Termina
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ubicación
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredEvents.map((event) => (
                            <tr className="border-b border-gray-200" key={event.id}>
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50"
                                >
                                    {event.title}
                                </th>
                                <td className="px-6 py-4">{event.start}</td>
                                <td className="px-6 py-4 bg-gray-50">{event.end}</td>
                                <td className="px-6 py-4">{event.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Organizer;