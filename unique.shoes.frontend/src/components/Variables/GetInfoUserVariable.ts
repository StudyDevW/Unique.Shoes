import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface GetUserStates {
  userCheckGet: boolean
  userCheckSet: (value: boolean) => void
}

const useGetInfoUserVariable = create<GetUserStates>()(
  devtools(
    persist(
      (set) => ({
        userCheckGet: true,
        userCheckSet: (value: boolean) => set({userCheckGet: value}),
      }),
      {
        name: 'getinfouser-storage',
      },
    ),
  ),
)

export default useGetInfoUserVariable