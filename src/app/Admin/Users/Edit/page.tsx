"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "@/components/atoms/Avatar/Avatar";
import { toast } from "react-toastify";

interface User {
  id: number;
  email_address: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  birth_date: string;
  avatar: string;
}

function EditUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem("editUser");
    if (userData) {
      setUser(JSON.parse(userData));
      sessionStorage.removeItem("editUser"); // Opcional: eliminar los datos después de cargarlos
    }
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      try {
        const response = await axios.post("/api/admin/editUser", user);

        if (response.status === 200) {
          toast.success("User updated successfully");
        } else {
          toast.error("Error updating user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Error updating user");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-around items-center h-dvh p-16">
      <section className="w-2/4">
        <h1 className="font-bold text-5xl mb-20">Edit User</h1>
        <form onSubmit={handleSave}>
          <div>
            <label className="font-bold" htmlFor="first_name">
              First name
            </label>
            <div className="flex gap-4">
              <input
                className="w-full bg-customGray h-12 rounded-md mb-4 p-2"
                type="text"
                name="first_name"
                id="first_name"
                placeholder="First name"
                value={user.first_name}
                onChange={handleChange}
              />
              <input
                className="w-full bg-customGray h-12 rounded-md mb-4 p-2"
                type="text"
                name="last_name"
                id="last_name"
                placeholder="Last name"
                value={user.last_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <label className="font-bold" htmlFor="email_address">
            Email
          </label>
          <input
            className="w-full bg-customGray h-12 rounded-md mb-4 p-2"
            type="text"
            name="email_address"
            id="email_address"
            placeholder="Email"
            value={user.email_address}
            onChange={handleChange}
          />
          <label className="font-bold" htmlFor="phone_number">
            Phone
          </label>
          <input
            className="w-full bg-customGray h-12 rounded-md mb-4 p-2"
            type="text"
            name="phone_number"
            id="phone_number"
            placeholder="Phone number"
            value={user.phone_number}
            onChange={handleChange}
          />
          <label className="font-bold" htmlFor="birth_date">
            Birth date
          </label>
          <input
            className="w-full bg-customGray h-12 rounded-md mb-4 p-2"
            type="text"
            name="birth_date"
            id="birth_date"
            placeholder="Birth date"
            value={user.birth_date}
            onChange={handleChange}
          />
          <button
            className="py-6 px-28 rounded-lg bg-customGreen hover:bg-lime-700 font-bold text-white mt-20"
            type="submit"
          >
            Guardar cambios
          </button>
        </form>
      </section>
      <section className="flex flex-col justify-around">
        <Avatar width={350} avatarOption={user.avatar} />
      </section>
    </div>
  );
}

export default EditUser;
