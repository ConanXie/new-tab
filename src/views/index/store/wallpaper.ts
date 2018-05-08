import { observable, computed, autorun } from "mobx"
import * as storage from "store2"

const defaultWallpaperData = {
  wallpaper: "",
  color: "#2196F3",
  useWallpaper: true,
  wallpaperType: 0
}

interface BackgroundStyles {
  backgroundImage?: string
  backgroundColor?: string
}
export class WallpaperStore {
  @observable public wallpaper: string
  @observable public color: string
  @observable public useWallpaper: boolean
  @observable public wallpaperType: number
  constructor() {
    const persistence = storage.get("wallpaper", {})
    const { wallpaper, color, useWallpaper, wallpaperType } = persistence
    this.wallpaper = wallpaper || defaultWallpaperData.wallpaper
    this.color = color || defaultWallpaperData.color
    this.useWallpaper = useWallpaper === undefined ? defaultWallpaperData.useWallpaper : Boolean(useWallpaper)
    this.wallpaperType = wallpaperType || defaultWallpaperData.wallpaperType
  }
  @computed get backgroundStyles() {
    const styles: BackgroundStyles = {}
    if (this.useWallpaper) {
      // 0: image
      // 1: color
      if (!this.wallpaperType) {
        styles.backgroundImage = `url(${this.wallpaper})`
      } else if (this.wallpaperType === 1) {
        styles.backgroundColor = this.color
      }
    }
    return styles
  }
}

const wallpaperStore = new WallpaperStore()

autorun(() => {
  storage.set("wallpaper", wallpaperStore)
})

export default wallpaperStore
