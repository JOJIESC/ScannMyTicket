import React from 'react'
import NavbarUser from '@/components/molecules/NavbarUser/NavbarUser'

export function LayoutUser({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div>
      <NavbarUser />
        {children}
    </div>
  )
}

export default LayoutUser
