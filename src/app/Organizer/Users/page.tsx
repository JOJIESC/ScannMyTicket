'use client'
import React, { useState } from 'react'
import axios from 'axios'
import Avatar from '@/components/atoms/Avatar/Avatar'

function UsersList() {

    const [user, setuser] = useState({
        id: ""
    })

    const getProfile = async () => {
        const response = await axios.get('/api/auth/PROFILE')
        setuser(response.data)
        console.log(response.data)
        console.log(user.id)
    }

    //esta funcion toma los datos del usuario y setea el usuario
    React.useEffect(() => {
        getProfile()
    }, [])


    const [MySubs, setMySubs] = useState([{
        email_address: "",
        username: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        avatar: "",
        title: ""
    }])

    const getMySubs = async (userID: string) => {
        console.log(userID)
        const response = await axios.post('/api/organizers/getMySubs', { user_id: userID })
        setMySubs(response.data)
        return response
    }

    React.useEffect(() => {
        if (user.id) {
            getMySubs(user.id)
        }
    }, [user.id])

    console.log(MySubs)

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredEvents, setFilteredEvents] = useState(MySubs);

    React.useEffect(() => {
        setFilteredEvents(
            MySubs.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        console.log(filteredEvents);
    }, [searchTerm, MySubs]);


    return (
        <div>
            {/* Barra de busqueda */}
            <div className='flex justify-end'>
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-96">
                        <input onChange={e => setSearchTerm(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 " placeholder="Busca un suscriptor..." />
                    </div>

            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <h4 className="text-3xl font-bold mb-3">Mis suscriptores:</h4>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 bg-gray-50">
                                Suscrito a
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Usuario
                            </th>
                            <th scope="col" className="px-6 py-3 bg-gray-50">
                                Apellido
                            </th>
                            <th scope="col" className="px-6 py-3">
                                @Email
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {MySubs.length === 1 && MySubs[0] === null ? (
                            <tr>
                                <td scope='row' colSpan={4} className='flex justify-center w-full'>No hay suscriptores</td>
                            </tr>
                        ) : (
                            filteredEvents && filteredEvents.map((subscriber) => {
                                return (
                                    <tr className="border-b border-gray-200" key={subscriber.username}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">
                                            {subscriber.title}
                                        </th>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Avatar width={40} avatarOption={subscriber.avatar} />
                                            {subscriber.first_name}
                                        </td>
                                        <td className="px-6 py-4 bg-gray-50">
                                            {subscriber.last_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {subscriber.email_address}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>



                </table>
            </div>

        </div>
    )
}

export default UsersList
