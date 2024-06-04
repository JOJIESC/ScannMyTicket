"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "@/components/atoms/Avatar/Avatar";
import { toast } from "react-toastify";

interface Organizer {
  id: number;
  email_address: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  birth_date: string;
  avatar: string;
  password: string;
}

function EditOrganizer() {
  const [organizer, setOrganizer] = useState<Organizer | null>(null);

  useEffect(() => {
    const organizerData = sessionStorage.getItem("editOrganizer");
    if (organizerData) {
      setOrganizer(JSON.parse(organizerData));
      sessionStorage.removeItem("editOrganizer");
    }
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (organizer) {
      try {
        const response = await axios.post(
          "/api/admin/editOrganizer",
          organizer
        );

        if (response.status === 200) {
          toast.success("Organizer updated successfully");
        } else {
          toast.error("Error updating organizer");
        }
      } catch (error) {
        console.error("Error updating organizer:", error);
        toast.error("Error updating organizer");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (organizer) {
      setOrganizer({
        ...organizer,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (!organizer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-around items-center h-dvh p-16">
      <section className="w-2/4">
        <h1 className="font-bold text-5xl mb-20">Edit Organizer</h1>
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
                value={organizer.first_name}
                onChange={handleChange}
              />
              <input
                className="w-full bg-customGray h-12 rounded-md mb-4 p-2"
                type="text"
                name="last_name"
                id="last_name"
                placeholder="Last name"
                value={organizer.last_name}
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
            value={organizer.email_address}
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
            value={organizer.phone_number}
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
            value={organizer.birth_date}
            onChange={handleChange}
          />
          <label className="font-bold" htmlFor="password">
            Password
          </label>
          <input
            className="w-full bg-customGray h-12 rounded-md mb-4 p-2"
            type="text"
            name="password"
            id="password"
            placeholder="Birth date"
            value={organizer.password}
            onChange={handleChange}
          />
          <button
            className="py-6 px-28 rounded-lg bg-customGreen hover:bg-lime-700 font-bold text-white mt-20"
            type="submit"
          >
            Guardar cambios
          </button>
          <button onClick={()=>window.location.href = '/Admin/Organizers'}
            className="py-6 px-28 rounded-lg bg-red-600 hover:bg-red-800 font-bold text-white mt-20"
            
          >
            Cancelar
          </button>
        </form>
      </section>
      <section className="flex flex-col justify-around">
        <Avatar width={350} avatarOption={organizer.avatar} />
      </section>
    </div>
  );
}

export default EditOrganizer;
