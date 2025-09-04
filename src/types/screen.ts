export type Screen = 
  | 'hero'
  | 'what-it-means'
  | 'what-next'
  | 'referral-form'
  | 'share'

export interface ScreenState {
  currentScreen: Screen
}

export interface ScreenActions {
  setScreen: (screen: Screen) => void
  getCurrentScreen: () => Screen
}

export type ScreenStore = ScreenState & ScreenActions
