import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface RegisterSuccessStates {
  registerSuccessGet: boolean
  registerSuccessSet: (value: boolean) => void
}

const useRegisterSuccessVariable = create<RegisterSuccessStates>()(
  devtools(
    persist(
      (set) => ({
        registerSuccessGet: false,
        registerSuccessSet: (value: boolean) => set({registerSuccessGet: value}),
      }),
      {
        name: 'registersuccess-storage',
      },
    ),
  ),
)

export default useRegisterSuccessVariable