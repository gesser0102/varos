'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          color: '#ededed',
        },
        className: 'font-sans',
      }}
    />
  )
}
