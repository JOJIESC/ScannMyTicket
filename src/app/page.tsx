'use client'

import { useState } from 'react'


export default function Example() {

  return (
<section className="flex items-center bg-stone h-full">
    <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className=" bg-gradient-to-br from-indigo-400 to-emerald-300 bg-clip-text text-transparent max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">Bienvenido a ScanMyTicket</h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl ">Crea, explora y suscribte a eventos.</p>
            <div>
            <a href="/login" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base text-center text-white rounded-lg bg-customGreen focus:ring-4 hover:bg-indigo-500 font-bold focus:ring-primary-300 ">
                Inicia Sesión
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
            <a href="/signup" className="inline-flex items-center justify-center px-5 py-3 text-base font-bold text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 ">
                Registrate
            </a>
            </div>
            <div className='mt-4'>
              <hr />
            <a href="/LoginOperator" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base text-center font-bold rounded-lg text-indigo-500 hover:text-customGreen focus:ring-4 focus:ring-primary-300">Inicia Sesión como operador</a>
            </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/img/hero.jpg" alt="mockup"/>
        </div>                
    </div>
</section>
  )
}
