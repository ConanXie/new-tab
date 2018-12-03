import { observable, computed, autorun, action } from "mobx"
import { settingsStorage } from "utils/storage"
import { sendMessage } from "utils/message"
import { toBase64 } from "utils/fileConversions"
import deepOrange from "@material-ui/core/colors/deepOrange"

export enum WallpaperType {
  Image = 1,
  Color = 2,
}

export const defaultWallpaperData = {
  wallpaper: "",
  color: deepOrange[500],
  useWallpaper: true,
  wallpaperType: WallpaperType.Image,
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
  @observable public wallpaperType: WallpaperType
  @observable public darkIcons: boolean
  constructor(data: any) {
    const {
      wallpaper,
      color,
      useWallpaper,
      wallpaperType,
      darkIcons
    } = data

    this.wallpaper = wallpaper || defaultWallpaperData.wallpaper
    this.color = color || defaultWallpaperData.color
    this.useWallpaper = useWallpaper === undefined ? defaultWallpaperData.useWallpaper : Boolean(useWallpaper)
    this.wallpaperType = wallpaperType || defaultWallpaperData.wallpaperType
    this.darkIcons = darkIcons === undefined ? defaultWallpaperData.darkIcons : Boolean(darkIcons)
  }
  @computed get wallpaperStyles() {
    const styles: WallpaperStyles = {}
    if (this.useWallpaper) {
      if (this.wallpaperType === WallpaperType.Image) {
        styles.backgroundImage = `url(${this.wallpaper})`
      } else if (this.wallpaperType === WallpaperType.Color) {
        styles.backgroundColor = this.color
      }
    }
    return styles
  }
  @computed get disabledImage() {
    return !this.useWallpaper || this.wallpaperType === WallpaperType.Color
  }
  @computed get disabledColor() {
    return !this.useWallpaper || this.wallpaperType === WallpaperType.Image
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
    this.wallpaperType = WallpaperType.Image
    this.wallpaper = url
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
