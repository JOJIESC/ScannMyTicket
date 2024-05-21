import React from 'react'
import Avatar from '@/components/atoms/Avatar/Avatar'

function Account() {
  return (
    <div className='flex justify-around items-center h-dvh p-16'>
      <section className='w-2/4'>
      <h1 className='font-bold text-5xl mb-20'>Edit User</h1>

      <div >
        <label className='font-bold' htmlFor="">First_name</label>
        <div className='flex gap-4'>
            <input className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="text" name="first_name" id="first_name" value='jorge' placeholder='first name'/>
            <input className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="text" name='last_name' id='last_name' placeholder='last_name' />
        </div>
      </div>
      <label className='font-bold' htmlFor="Email">Email</label>
      <input className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="text" name="Email" id="Email" />
        <label className='font-bold' htmlFor="Password">Password</label>
        <input className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="password" name="Password" id="Password" />
        <label className='font-bold' htmlFor="BirthDate">Birth date</label>
        <input className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="text" name='BirthDate' id='BirthDate'/>
      </section>
      <section className='flex flex-col justify-around'>
        <Avatar width={350}/>
        <button className="py-6 px-28 rounded-lg bg-customGreen hover:bg-lime-700 font-bold text-white mt-20">Guardar cambios</button>
      </section>
    </div>
  )
}

export default Account
