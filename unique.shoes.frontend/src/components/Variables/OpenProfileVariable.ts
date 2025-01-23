import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface openProfileStates {
  openProfileGet: boolean
  openProfileSet: (value: boolean) => void
}

const useOpenProfileVariable = create<openProfileStates>()(
  devtools(
    persist(
      (set) => ({
        openProfileGet: false,
        openProfileSet: (value: boolean) => set({openProfileGet: value}),
      }),
      {
        name: 'openprofile-storage',
      },
    ),
  ),
)

export default useOpenProfileVariable