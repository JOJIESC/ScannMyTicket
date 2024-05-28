'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function Unaunthorized() {
    const router = useRouter()
    const handleRedirect = () => {
        router.back()
    }
  return (
    <div className='bg-[#141217] text-white w-full h-full flex flex-col justify-center items-center'>
      <Image src='/img/unaunthorized.png' width={450} height={450} alt='unanthorized'/>
      <h1 className='font-bold text-6xl'>403</h1>
      <h1 className='font-bold text-4xl'>WHOOPS!</h1>
        <h1 className=''>No tienes las credenciales para acceder a esta página</h1>
        <button onClick={handleRedirect} className='py-4 px-10 bg-customGray rounded-lg text-black font-bold mt-4'>Regresar</button>
    </div>
  )
}

export default Unaunthorized
