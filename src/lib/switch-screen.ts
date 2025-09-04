import useScreenStore from "@/store/use-screen-store"
import { Screen } from "@/types/screen"

function switchScreen(screen: Screen) {
  useScreenStore.getState().setScreen(screen)
}

export default switchScreen
