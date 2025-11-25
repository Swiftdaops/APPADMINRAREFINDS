import React from 'react'

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border rounded shadow-sm p-4 card ${className}`}>
      {children}
    </div>
  )
}

export default Card
