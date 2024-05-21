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
      <div>
      {children}
      </div>
    </main>
  )
}

export default LayoutOrganizer
