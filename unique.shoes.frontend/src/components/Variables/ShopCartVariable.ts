import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ShopCartProperties {
    shopCartInfo: {
        count: number,
        totalPrice: number
    },
    shopCartItem: {
        id: number,
        itemId: number,
        hashName: string,
        name: string,
        price: number,
        countItem: number,
        size: string,
        imageLink: string
    }[]
}

interface ShopCartStates {
    shopCartGet: ShopCartProperties | null
    shopCartSet: (value: ShopCartProperties | null) => void
}

const useShopCartVariable = create<ShopCartStates>()(
    devtools(
      persist(
        (set) => ({
            shopCartGet: null,
            shopCartSet: (value: ShopCartProperties | null) => set({shopCartGet: value}),
        }),
        {
          name: 'shopcart-storage',
        },
      ),
    ),
  )
  
  export default useShopCartVariable