import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ButtonPanelStates {
  PButtonActiveGet: string
  PButtonActiveSet: (value: string) => void
}

const useButtonActivePanel = create<ButtonPanelStates>()(
  devtools(
    persist(
      (set) => ({
        PButtonActiveGet: "add_button",
        PButtonActiveSet: (value: string) => set({PButtonActiveGet: value}),
      }),
      {
        name: 'buttonpanel-storage',
      },
    ),
  ),
)

export default useButtonActivePanel