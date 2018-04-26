import { observable } from "mobx"

export class Wallpaper {
  @observable public useWallpaper: boolean = false
  @observable public wallpaperType: number = 0
  public saveUseWallpaper(state: boolean) {
    this.useWallpaper = state
  }
  public saveWallpaperType(type: number) {
    this.wallpaperType = type
  }
}

export default new Wallpaper()
