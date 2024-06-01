import React from 'react'
import  ScannedCard  from '@/components/atoms/ScannedCard/ScannedCard'

function LastScanned() {
    return (
        <div className="flex min-h-full flex-1 flex-col px-6 py-5 lg:px-8 gap-4">
            <header>
                <button>
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                </button>
            </header>
            <div>{/* container */}
                <h1 className='w-full font-bold text-3xl mb-9'>Ultimos codigos escaneados</h1>
                <div className='flex gap-3'>
                    {/* LastScanned card */}
                    <ScannedCard 
                    username='username'
                    titleEvent='titleEvent'
                    fechaEscaneo='fechaEscaneo'
                    horaEscaneo='horaEscaneo'
                    />
                </div>
            </div>
        </div>
    )
}

export default LastScanned
