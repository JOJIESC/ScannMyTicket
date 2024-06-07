"use client";
import React, { useState } from "react";
import QrReaderComponent from "@/components/atoms/QrReader/QrReader";
import BackButton from "@/components/atoms/BackButton/BackButton";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

function Scanner() {

  const router = useRouter()
  const params = useParams()
  console.log(params)
  const event_id = params.event_id
  console.log(event_id)
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Traer datos del operador
  const [user, setuser] = useState({
    id: "",
    email_address: "",
  });

  const getProfile = async () => {
    try {
      const response = await axios.get('/api/auth/PROFILE');
      setuser(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoadingUser(false);
    }
  }

  React.useEffect(() => {
    getProfile()
  }, [])

  console.log(user.email_address)

  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-5 lg:px-8 gap-4">
      <header>
        <BackButton />
      </header>
      <div className="qr-page flex flex-col items-center p-4 md:p-8 lg:p-16">
        <div className="flex items-center mb-8">
          <svg height="48px" viewBox="0 -960 960 960" width="48px" fill="#8C1AF6">
            <path d="M349-120H180q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h169v60H180v600h169v60Zm103 80v-880h60v880h-60Zm163-80v-60h60v60h-60Zm0-660v-60h60v60h-60Zm165 660v-60h60q0 25-17.62 42.5Q804.75-120 780-120Zm0-165v-60h60v60h-60Zm0-165v-60h60v60h-60Zm0-165v-60h60v60h-60Zm0-165v-60q24.75 0 42.38 17.62Q840-804.75 840-780h-60Z" />
          </svg>
          <h1 className="font-bold text-2xl ml-4">Scan QR Code</h1>
        </div>
        <div className="qr-section flex justify-center w-full h-full relative">
          <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-black"></div>
            <div className="rounded-sm">
              <QrReaderComponent className="w-full h-full" event_id={event_id} operator_email={user.email_address} />
            </div>
          </div>
        </div>
            <p className="flex items-center max-w-96"><span className="material-symbols-outlined text-yellow-400">
              notification_important
            </span>En caso de que el escaner deje de escanear, por favor refresca la página</p>
      </div>
    </div>
  );
}

export default Scanner;
