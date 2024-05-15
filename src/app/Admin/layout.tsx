import React from 'react'

function LayoutAdmin({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div>
      {/* componente side Bar */}
      {children}
    </div>
  )
}

export default LayoutAdmin
