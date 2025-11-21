import React from 'react'

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border rounded shadow-sm p-4 ${className}`}>
      {children}
    </div>
  )
}

export default Card
