import React from 'react'

const DashboardProvider = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default DashboardProvider