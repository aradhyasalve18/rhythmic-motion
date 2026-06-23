import { createContext, useCallback, useContext, useState } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [prefill, setPrefill] = useState({ style: '', className: '' })

  const openBooking = useCallback((data = {}) => {
    setPrefill({ style: data.style || '', className: data.className || '' })
    setIsOpen(true)
  }, [])

  const closeBooking = useCallback(() => setIsOpen(false), [])

  return (
    <BookingContext.Provider value={{ isOpen, prefill, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return ctx
}
