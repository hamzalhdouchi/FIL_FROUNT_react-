import React from "react"

export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500 ${className}`}
    />
  )
}
