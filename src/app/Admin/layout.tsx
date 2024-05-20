import React from 'react'
import SideBarAdmin from '@/components/molecules/SideBarAdmin/SideBarAdmin'

function LayoutAdmin({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <>
      <SideBarAdmin/>
      <main>
      {children}
      </main>
    </>
  )
}

export default LayoutAdmin
