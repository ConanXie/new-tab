import { observable, autorun } from "mobx"

export class Wallpaper {
  @observable public wallpaper: string = localStorage.getItem("wallpaper") || ""
  @observable public useWallpaper: boolean = false
  @observable public wallpaperType: number = 0
  public saveUseWallpaper(state: boolean) {
    this.useWallpaper = state
  }
  public saveWallpaperType(type: number) {
    this.wallpaperType = type
  }
}

const wallpaper = new Wallpaper()

autorun(() => {
  console.log(wallpaper.useWallpaper)
})

export default wallpaper
