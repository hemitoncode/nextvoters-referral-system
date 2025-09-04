import { create } from 'zustand'
import { Screen, ScreenState, ScreenStore } from '@/types/screen'

const initialState: ScreenState = {
  currentScreen: 'hero',
}

export const useScreenStore = create<ScreenStore>((set, get) => ({
  ...initialState,

  setScreen: (screen: Screen) => {
    set(() => ({
      currentScreen: screen,
    }))
  },

  getCurrentScreen: () => get().currentScreen,
  
}))

export default useScreenStore
