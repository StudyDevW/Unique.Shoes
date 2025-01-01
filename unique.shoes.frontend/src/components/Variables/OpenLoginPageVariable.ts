import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface loginPageOpenedStates {
  loginPageOpenedGet: boolean
  loginPageOpenedSet: (value: boolean) => void
}

const useloginPageOpenedVariable = create<loginPageOpenedStates>()(
  devtools(
    persist(
      (set) => ({
        loginPageOpenedGet: false,
        loginPageOpenedSet: (value: boolean) => set({loginPageOpenedGet: value}),
      }),
      {
        name: 'loginPageOpened-storage',
      },
    ),
  ),
)

export default useloginPageOpenedVariable