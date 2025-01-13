import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ItemProperties {
    id: number,
    name: string,
    description: string
    price: number
    sizes: string[]
    imagePaths: string[]
}

interface ItemPrevewStates {
    itemPrevewGet: ItemProperties | null
    itemPrevewSet: (value: ItemProperties | null) => void
}

const useItemPreviewVariable = create<ItemPrevewStates>()(
    devtools(
      persist(
        (set) => ({
          itemPrevewGet: null,
          itemPrevewSet: (value: ItemProperties | null) => set({itemPrevewGet: value}),
        }),
        {
          name: 'itempreview-storage',
        },
      ),
    ),
  )
  
  export default useItemPreviewVariable