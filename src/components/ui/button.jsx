import React from 'react'

export function Button({ children, className = '', ...props }) {
  return (
    <button className={`px-3 py-2 bg-blue-600 text-white rounded card ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
