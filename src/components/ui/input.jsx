import React from 'react'

const Input = React.forwardRef(function Input(props, ref) {
  return (
    <input ref={ref} className="border rounded px-3 py-2 w-full card" {...props} />
  )
})

export { Input }
export default Input
