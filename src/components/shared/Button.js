import React from 'react'
import { classNames } from './Utils'

export function Button({ children, className, ...rest }) {
  return (
    <button
      type="button"
      className={
        classNames(
          "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-slate-700 hover:bg-gray-50",
          className
        )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function PageButton({ children, className, ...rest }) {
  return (
    <button
      type="button"
      className={
        classNames(
          "relative inline-flex items-center px-2 py-2 border border-slate-600-300 bg-slate-700 text-sm font-medium text-slate-100 hover:bg-gray-200",
          className
        )}
      {...rest}
    >
      {children}
    </button>
  )
}

