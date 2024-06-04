'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@/components/atoms/Avatar/Avatar";

interface Organizer {
    id: number;
    username: string;
    avatar: string;
    email_address: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    birth_date: string;
}

export default function OrganizerTable() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [organizadoresData, setOrganizadoresData] = useState<Organizer[]>([]);
    const [user, setUser] = useState({
        username: "",
        avatar: ""
    });

    const getProfile = async () => {
        const response = await axios.get('/api/auth/PROFILE')
        setUser(response.data)
        console.log(response)
    }

    useEffect(() => {
        getProfile()
    }, [])

    const getOrganizers = async () => {
        try {
            const response = await axios.get<Organizer[]>('/api/organizers');
            setOrganizadoresData(response.data);
        } catch (error) {
            console.error("Error fetching organizers data:", error);
        }
    };

    useEffect(() => {
        getOrganizers();
    }, []);

    const filteredOrganizers = organizadoresData.filter(organizer =>
        `${organizer.first_name} ${organizer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (organizer: Organizer) => {
        sessionStorage.setItem('editOrganizer', JSON.stringify(organizer));
        window.location.href = `/Admin/Organizers/Edit`;
    };

    return (
        <div className="flex flex-col justify-center w-full h-full gap-3">
            <div className="w-full p-4">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="font-bold text-5xl">Organizadores</h1>
                    <input
                        className="w-80 bg-customGray h-10 rounded-md p-2 shadow"
                        type="text"
                        placeholder="Busca un organizador"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    <table className="min-w-full bg-customGray">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">Avatar</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">Name</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">E-mail</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">Phone</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">Birthday</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrganizers.map(organizer => (
                                <tr key={organizer.id}>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">
                                        <Avatar avatarOption={organizer.avatar} width={50} />
                                    </td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">
                                        {organizer.first_name} {organizer.last_name}
                                    </td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">{organizer.email_address}</td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">{organizer.phone_number}</td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">{organizer.birth_date}</td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">
                                        <button onClick={() => handleEdit(organizer)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15.232 5.232l3.536 3.536M9 11l7.5-7.5m-6 6H6v6h6v-2m2-3l4-4m-2 2h6v6h-6v-2"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
