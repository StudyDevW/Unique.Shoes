import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface LoginSuccessStates {
  loginSuccessGet: boolean
  loginSuccessSet: (value: boolean) => void
}

const useLoginSuccessVariable = create<LoginSuccessStates>()(
  devtools(
    persist(
      (set) => ({
        loginSuccessGet: true,
        loginSuccessSet: (value: boolean) => set({loginSuccessGet: value}),
      }),
      {
        name: 'loginsuccess-storage',
      },
    ),
  ),
)

export default useLoginSuccessVariable