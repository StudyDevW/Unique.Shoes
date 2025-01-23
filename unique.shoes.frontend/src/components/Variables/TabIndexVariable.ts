import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface tabIndexStates {
  tabIndexGet: number
  tabIndexSet: (value: number) => void
}

const useTabIndexVariable = create<tabIndexStates>()(
  devtools(
    persist(
      (set) => ({
        tabIndexGet: 0,
        tabIndexSet: (value: number) => set({tabIndexGet: value}),
      }),
      {
        name: 'headertabindex-storage',
      },
    ),
  ),
)

export default useTabIndexVariable