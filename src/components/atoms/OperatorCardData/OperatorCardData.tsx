import React from 'react'

function OperatorCardData({ email, password,onRemove }: { email: string, password: string, onRemove: () => void}) {

    return (
        <div className='w-full border-2 rounded-md flex justify-between items-center px-5'>
            <div>
            <p className='font-bold'>Email: {email}</p>
            <p className='font-bold'>Password: {password}</p>
            </div>
            <button onClick={onRemove}><svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
        </div>
    )
}

export default OperatorCardData
