import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface closeProfileStates {
  closeProfileGet: boolean
  closeProfileSet: (value: boolean) => void
}

const useCloseProfileVariable = create<closeProfileStates>()(
  devtools(
    persist(
      (set) => ({
        closeProfileGet: false,
        closeProfileSet: (value: boolean) => set({closeProfileGet: value}),
      }),
      {
        name: 'close-profile-storage',
      },
    ),
  ),
)

export default useCloseProfileVariable