import { observable, computed, autorun } from "mobx"
import { settingsStorage } from "utils/storage"

const defaultWallpaperData = {
  wallpaper: "",
  color: "#FF5722",
  useWallpaper: true,
  wallpaperType: 0,
  darkIcons: false
}

interface WallpaperStyles {
  backgroundImage?: string
  backgroundColor?: string
}
export class WallpaperStore {
  @observable public wallpaper: string
  @observable public color: string
  @observable public useWallpaper: boolean
  @observable public wallpaperType: number
  @observable public darkIcons: boolean
  constructor() {
    const persistence = settingsStorage.get("wallpaper", {})
    const {
      wallpaper,
      color,
      useWallpaper,
      wallpaperType,
      darkIcons
    } = persistence

    this.wallpaper = wallpaper || defaultWallpaperData.wallpaper
    this.color = color || defaultWallpaperData.color
    this.useWallpaper = useWallpaper === undefined ? defaultWallpaperData.useWallpaper : Boolean(useWallpaper)
    this.wallpaperType = wallpaperType || defaultWallpaperData.wallpaperType
    this.darkIcons = darkIcons === undefined ? defaultWallpaperData.darkIcons : Boolean(darkIcons)
  }
  @computed get wallpaperStyles() {
    const styles: WallpaperStyles = {}
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
  @computed get disabledImage() {
    return !this.useWallpaper || this.wallpaperType === 1
  }
  @computed get disabledColor() {
    return !this.useWallpaper || !this.wallpaperType
  }
}

const wallpaperStore = new WallpaperStore()

autorun(() => {
  settingsStorage.set("wallpaper", wallpaperStore)
})

export default wallpaperStore
