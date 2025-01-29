import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface registerPageOpenedStates {
  registerPageOpenedGet: boolean
  registerPageOpenedSet: (value: boolean) => void
}

const useregisterPageOpenedVariable = create<registerPageOpenedStates>()(
  devtools(
    persist(
      (set) => ({
        registerPageOpenedGet: false,
        registerPageOpenedSet: (value: boolean) => set({registerPageOpenedGet: value}),
      }),
      {
        name: 'registerPageOpened-storage',
      },
    ),
  ),
)

export default useregisterPageOpenedVariable