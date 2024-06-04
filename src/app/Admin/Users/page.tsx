'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@/components/atoms/Avatar/Avatar";

interface User {
    id: number;
    username: string;
    email_address: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    birth_date: string;
    avatar: string; 
}

export default function Usertable() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [usersData, setUsersData] = useState<User[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get<User[]>('/api/admin/getAllUsers');
                setUsersData(response.data);
            } catch (error) {
                console.error("Error fetching users data:", error);
            }
        };

        getUsers();
    }, []);

    const filteredUsers = usersData.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (user: User) => {
        sessionStorage.setItem('editUser', JSON.stringify(user));
        window.location.href = `/Admin/Users/Edit`;
    };

    return (
        <div className="flex flex-col justify-center w-full h-full gap-3">
            <div className="w-full p-4">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="font-bold text-5xl">Usuarios</h1>
                    <input
                        className="w-80 bg-customGray h-10 rounded-md p-2 shadow"
                        type="text"
                        placeholder="Busca un usuario"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    <table className="min-w-full bg-customGray">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">Photo</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">Name</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">E-mail</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">Phone</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">Birthday</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">
                                    <Avatar avatarOption={user.avatar} width={50} />
                                    </td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">
                                        {user.first_name} {user.last_name}
                                    </td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">{user.email_address}</td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">{user.phone_number}</td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">{user.birth_date}</td>
                                    <td className="py-2 px-4 border-b-2 border-gray-300 text-center">
                                        <button onClick={() => handleEdit(user)}>
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
