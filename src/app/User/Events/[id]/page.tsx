'use client'
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Event } from "@/types"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import BackButton from "@/components/atoms/BackButton/BackButton"
import { http } from "@/libs/http"

async function fetchEvent(eventID: number) {
  const { data } = await http.get(`/api/events/${eventID}`)
  return data
}

async function getProfile() {
  const { data } = await http.get('/api/auth/PROFILE')
  return data
}

export default function EventDetails({ params }: { params: { id: string } }) {
  const eventID = Number(params.id)
  const [evento, setEvento] = useState<Event | null>(null)
  const [userID, setUserID] = useState<number | null>(null)

  useEffect(() => {
    getProfile().then(p => setUserID(Number(p.id))).catch(() => setUserID(null))
  }, [])

  useEffect(() => {
    fetchEvent(eventID).then(setEvento).catch(() => {
      toast.error('No se pudo cargar el evento')
    })
  }, [eventID])

  const subscribe = async () => {
    if (!userID) {
      toast.warn('Inicia sesión para suscribirte')
      return
    }
    try {
      const res = await http.post('/api/events/subscribe', { userID, eventID })
      if (res.status === 200 || res.status === 201) {
        toast.success('Suscripción generada. Tu QR estará disponible en "Mis Tickets".')
      } else {
        toast.warn('No se pudo suscribir')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al suscribirse'
      toast.error(msg)
    }
  }

  if (!evento) return <main className="p-6">Cargando…</main>

  const safeSrc =
    (evento?.image_url && (evento.image_url.startsWith('http') || evento.image_url.startsWith('/')))
      ? evento.image_url
      : 'https://picsum.photos/1200/500?blur=3';


  return (
    <main className="flex min-h-screen w-full">
      <BackButton />
      <div className="max-w-4xl mx-auto p-4 w-full">
        <div className="relative h-64 w-full mb-4">
          <Image src={safeSrc} alt={evento.title} fill className="object-cover rounded-xl" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">{evento.title}</h1>
        <p className="text-gray-600 mb-4">{evento.description}</p>
        <div className="flex gap-3">
          <button onClick={subscribe} className="px-4 py-2 rounded bg-black text-white">Suscribirme</button>
        </div>
      </div>
    </main>
  )
}
