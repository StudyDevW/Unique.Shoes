import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ButtonPanelStates {
  MPButtonActiveGet: string
  MPButtonActiveSet: (value: string) => void
}

const useButtonActiveProfile = create<ButtonPanelStates>()(
  devtools(
    persist(
      (set) => ({
        MPButtonActiveGet: "add_button",
        MPButtonActiveSet: (value: string) => set({MPButtonActiveGet: value}),
      }),
      {
        name: 'profile-button-storage',
      },
    ),
  ),
)

export default useButtonActiveProfile