import { atom } from 'jotai'

export const activeTabAtom = atom(0)
export const modalAtom = atom(false)

// Атом для хранения информации о пользователе, включая id
export const userAtom = atom(null)

export const isAuthenticatedAtom = atom(localStorage.getItem('isAuthenticated') === 'true')
