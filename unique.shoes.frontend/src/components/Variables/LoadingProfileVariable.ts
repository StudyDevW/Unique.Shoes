import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface LoadingStates {
  profileloadingGet: boolean
  profileloadingSet: (value: boolean) => void
}

const useLoadingProfile = create<LoadingStates>()(
  devtools(
    persist(
      (set) => ({
        profileloadingGet: true,
        profileloadingSet: (value: boolean) => set({profileloadingGet: value}),
      }),
      {
        name: 'loading-storage',
      },
    ),
  ),
)

export default useLoadingProfile