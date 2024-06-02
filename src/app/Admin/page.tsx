'use client';
import React, { useState } from "react";
import Avatar from "@/components/atoms/Avatar/Avatar";
import EventCounter from "@/components/atoms/EventCounter/EventCounter";
import axios from "axios";



export default function Admin() {

        const [user, setuser] = useState({
            username: "",
            avatar: ""
        });

        const [NumUsers, setNumUsers] = useState(0)
        const [NumOrganizers, setNumOrganizers] = useState(0)
        const [NumEvents, setNumEvents] = useState(0)
        const [NumAdmins, setNumAdmins] = useState(0)

        const [organizadoresData, setOrganizadoresData] = useState([
            {
                avatar: ""
            }
        ])

        const [UsersData, setUsersData] = useState([
            {
                avatar: ""
            }
        
        ])

        const getProfile = async () => {
            const response = await axios.get('/api/auth/PROFILE')
            setuser(response.data)
            console.log(response)
        }

        //esta funcion toma los datos del usuario y setea el usuario
        React.useEffect(() => {
            getProfile()
        }, [])

        // traemos los datos de los organizadores
        const getOrganizers = async () => {
            const organizers = await axios.get('/api/organizers')
            console.log(organizers.data)
            setOrganizadoresData(organizers.data)
            return organizadoresData
        }

        React.useEffect(() => {
            getOrganizers()
        }, [])

        // traemos los datos de los usuarios
        const getUsers = async () => {
            const users = await axios.get('/api/admin/getAllUsers')
            console.log(users.data)
            setUsersData(users.data)
            return UsersData
        }

        React.useEffect(() => {
            getUsers()
        }, [])

        // STATS ------------------------------

        const getNumerOfUsers = async () => {
            const NumberUsers = await axios.get('/api/admin/countUsers')
            setNumUsers(NumberUsers.data[0].total_users)
            console.log(NumberUsers.data[0].total_users)
            return NumberUsers.data
        }

        React.useEffect(() => {
            getNumerOfUsers()
        }, [])

        const getNumerOfOrganizers = async () => {
            const NumberOrganizers = await axios.get('/api/admin/countOrganizers')
            setNumOrganizers(NumberOrganizers.data[0].total_organizers)
            console.log(NumberOrganizers.data[0].total_organizers)
            return NumberOrganizers.data
        }

        React.useEffect(() => {
            getNumerOfOrganizers()
        }, [])

        const getNumberOfAdmins = async () => {
            const NumberAdmins = await axios.get('/api/admin/countAdmins')
            setNumAdmins(NumberAdmins.data[0].total_admins)
            console.log(NumberAdmins.data[0].total_admins)
            return NumberAdmins.data
        }

        React.useEffect(() => {
            getNumberOfAdmins()
        }, [])

        const getNumerOfEvents = async () => {
            const NumberEvents = await axios.get('/api/admin/countEvents')
            setNumEvents(NumberEvents.data[0].total_events)
            console.log(NumberEvents.data[0].total_events)
            return NumberEvents.data
        }

        React.useEffect(() => {
            getNumerOfEvents()
        }, [])

        return (
            <div className="flex flex-col justify-center max-w-7xl gap-3">
                <div className="ml-16 flex jutify-between gap-16 items-center mb-8">
                    <Avatar avatarOption={user.avatar} width={100} />
                    <div>
                        <h1 className="font-bold text-5xl">Dashboard</h1>
                        <p className="text-base text-gray-600">Bienvenido {user.username}</p>
                    </div>
                    <input className="flex-grow bg-customGray h-10 rounded-md p-2 shadow" type="text" placeholder="Busca un evento" />
                </div>
                <div className="flex gap-4 ">
                    <EventCounter count={NumUsers} label="Total de usuarios" />
                    <EventCounter count={NumEvents} label="Total de eventos" />
                    <EventCounter count={NumOrganizers} label="Total organizadores" />
                    <EventCounter count={NumAdmins} label="Total Admins" />
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full h-40">
                    <h2 className="font-bold mb-2 font-2xl">Users:</h2>
                    <div className="ml-8 -space-x-2 flex items-center flex-wrap">
                        {UsersData.map((user,index) => { 
                            return (
                                <Avatar key={index} avatarOption={user.avatar} width={50} />
                            )
                        })}
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full h-40">
                    <h2 className="font-bold mb-2 font-2xl">Organizers:</h2>
                    <div className="ml-8 -space-x-2 flex items-center">
                        {organizadoresData.map((organizer,index) => { 
                            return (
                                <Avatar key={index} avatarOption={organizer.avatar} width={50} />
                            )
                        })}
                    </div>
                </div>
            </div>
        );

    }
