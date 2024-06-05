import React from 'react'
import { useRouter } from 'next/navigation'


function BackButton() {
    const router = useRouter()

    const handleBack = ()=>{
        router.back()
    }

    return (
        <div className='flex justify-start'>
            <button onClick={handleBack} className='hover:bg-customGreen hover:text-white font-bold p-4 rounded-full'>
                <span className="material-symbols-outlined">
                    arrow_back
                </span>
            </button>
        </div>
    )
}

export default BackButton
