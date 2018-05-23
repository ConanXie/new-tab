import { observable, computed, autorun, action, transaction } from "mobx"
import { settingsStorage } from "utils/storage"
import { sendMessage } from "utils/message"
import { toBase64 } from "utils/fileConversions"

export const defaultWallpaperData = {
  wallpaper: "",
  color: "#FF5722",
  useWallpaper: true,
  wallpaperType: 1,
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
  constructor(persistence: any) {
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
      // 1: image
      // 2: color
      if (this.wallpaperType === 1) {
        styles.backgroundImage = `url(${this.wallpaper})`
      } else if (this.wallpaperType === 2) {
        styles.backgroundColor = this.color
      }
    }
    return styles
  }
  @computed get disabledImage() {
    return !this.useWallpaper || this.wallpaperType === 2
  }
  @computed get disabledColor() {
    return !this.useWallpaper || this.wallpaperType === 1
  }
  @action("wallpaper switch")
  public wallpaperSwitch = () => {
    this.useWallpaper = !this.useWallpaper
  }
  @action("update wallpaper -- image")
  public updateWallpaper = async (file: File | Blob) => {
    // Save base64 data to storage
    const base64 = await toBase64(file)
    sendMessage("saveWallpaper", base64)
  }
  @action("wallpaper updated -- image")
  public wallpaperUpdated = (url: string) => {
    transaction(() => {
      this.wallpaperType = 1
      this.wallpaper = url
    })
  }
  @action("change wallpaper type")
  public changeWallpaperType = (value: number) => {
    this.wallpaperType = value
  }
  @action("handle background color change")
  public handleColorChange = (color: string) => {
    this.color = color
  }
  @action("toggle dark icons")
  public toggleDarkIcons = () => {
    this.darkIcons = !this.darkIcons
  }
}

const persistence = settingsStorage.get("wallpaper", {})
const wallpaperStore = new WallpaperStore(persistence)

autorun(() => {
  settingsStorage.set("wallpaper", wallpaperStore)
})

export default wallpaperStore
