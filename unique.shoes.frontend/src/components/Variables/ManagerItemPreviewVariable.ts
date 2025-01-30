import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface MItemProperties {
    id: number,
    hashName: string,
    name: string,
    description: string
    price: number
    sizes: string[]
    imagePaths: string[]
}

interface MItemPrevewStates {
    MitemPrevewGet: MItemProperties | null
    MitemPrevewSet: (value: MItemProperties | null) => void
}

const useMItemPreviewVariable = create<MItemPrevewStates>()(
    devtools(
      persist(
        (set) => ({
          MitemPrevewGet: null,
          MitemPrevewSet: (value: MItemProperties | null) => set({MitemPrevewGet: value}),
        }),
        {
          name: 'Mitempreview-storage',
        },
      ),
    ),
  )
  
  export default useMItemPreviewVariable