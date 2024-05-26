import React from 'react'
import SideBarOrganizer from '@/components/molecules/SideBarOrganizer/SideBarOrganizer';

function LayoutOrganizer({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <main className='flex'>
      <SideBarOrganizer />
      <div className='w-full h-full p-5'>
      {children}
      </div>
    </main>
  )
}

export default LayoutOrganizer
