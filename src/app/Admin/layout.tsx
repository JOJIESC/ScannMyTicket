import React from 'react'
import SideBarAdmin from '@/components/molecules/SideBarAdmin/SideBarAdmin'

function LayoutAdmin({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
<main className='flex'>
    <SideBarAdmin />
    <div className='w-full flex justify-start'>
      {children}
    </div>
</main>
  )
}

export default LayoutAdmin
