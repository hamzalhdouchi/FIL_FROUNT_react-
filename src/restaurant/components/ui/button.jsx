import React from "react"

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-md font-medium transition duration-300 ${className}`}
    >
      {children}
    </button>
  )
}
