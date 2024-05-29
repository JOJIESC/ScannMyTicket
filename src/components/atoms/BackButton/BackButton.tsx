import React from 'react'
import { useRouter } from 'next/navigation'


function BackButton() {
    const router = useRouter()

    const handleBack = ()=>{
        router.back()
    }

    return (
        <div className='flex justify-start'>
            <button onClick={handleBack}>
                <span className="material-symbols-outlined">
                    arrow_back
                </span>
            </button>
        </div>
    )
}

export default BackButton
