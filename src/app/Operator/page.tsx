import React from 'react'
import Avatar from '@/components/atoms/Avatar/Avatar'
import Link from 'next/link'

function DashboardOperator() {
    return (
        <div className="flex min-h-full flex-1 flex-col px-6 py-5 lg:px-8 gap-4">
            <header className='w-full flex justify-end '>
                <button><span className="material-symbols-outlined">
                    logout
                </span></button>
            </header>
            <div className='flex flex-col justify-center items-center'>
                <Avatar width={100} />
                <h1>Operador</h1>
                <p>Welcome Back </p>
            </div>

            <h2 className='font-bold text-xl'>Datos sobre tu evento:</h2>
            <div className='flex flex-col  bg-customGray rounded-lg p-7'>
                <div>
                    <h3>Titulo</h3>
                    <p>Fecha de inicio: 2021-10-10</p>
                    <p>Hora de inicio: HH-MM</p>
                    <p>Fecha de fin: 2021-10-10</p>
                    <p>Hora de conclusión: HH-MM</p>
                    <p>Ubicación: CDMX</p>
                </div>
            </div>
                <div className='flex flex-col gap-2 text-white'>
                <Link href='#' className='bg-[url("/img/operator/escaneaCodigos.png")] bg-cover h-40 w-full bg-center rounded-lg relative'>
                    <p className='font-bold absolute text-2xl left-3 top-3 w-24'>Escanea codigos</p>
                </Link>
                <Link href='#' className='bg-[url("/img/operator/checkScanns.png")] bg-cover h-40 w-full bg-center rounded-lg relative'>
                    <p className='font-bold absolute text-2xl left-3 top-3 w-24'>
                        Ultimos elementos escaneados
                    </p>
                </Link>
                </div>

        </div>
    )
}

export default DashboardOperator
