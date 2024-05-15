'use client'

import { useState } from 'react'


export default function Example() {

  return (
    <div className="bg-slate-900">


      <div className="relative isolate px-6 pt-14 lg:px-8 h-dvh">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl  text-white">
              Bienvenido a Scann My Ticket            </h1>
            <p className="mt-6 text-lg leading-8  text-white">
              Ingresa a uno de nuestra lista de eventos y suscribete para obtener acceso; genera tus propios eventos y compartelos con la gente. Suscribete, escanea y disfruta.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Inicia Sesión
              </a>
              <a href="./signup" className="text-sm font-semibold leading-6 text-white">
                Registrate <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
        </div>
      </div>
    </div>
  )
}
