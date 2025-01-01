import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ErrAccessTokenStates {
  errAccessGet: boolean
  errAccessSet: (value: boolean) => void
}

const useErrAccessTokenVariable = create<ErrAccessTokenStates>()(
  devtools(
    persist(
      (set) => ({
        errAccessGet: false,
        errAccessSet: (value: boolean) => set({errAccessGet: value}),
      }),
      {
        name: 'erraccessToken-storage',
      },
    ),
  ),
)

export default useErrAccessTokenVariable