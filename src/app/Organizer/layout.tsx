import React from 'react'
import SideBarOrganizer from '@/components/molecules/SideBarOrganizer/SideBarOrganizer';

function LayoutOrganizer({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div>
      <SideBarOrganizer />
      {children}
    </div>
  )
}

export default LayoutOrganizer
