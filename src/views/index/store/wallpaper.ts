import { observable, computed, autorun } from "mobx"
// import { StyleRules } from "material-ui/styles/withStyles"

interface BackgroundStyles {
  backgroundImage?: string
  backgroundColor?: string
}
export class Wallpaper {
  @observable public wallpaper: string = localStorage.getItem("wallpaper") || ""
  @observable public color: string = localStorage.getItem("wallpaper-color") || "#ffffff"
  @observable public useWallpaper: boolean = false
  @observable public wallpaperType: number = 0
  @computed get backgroundStyles() {
    const styles: BackgroundStyles = {}

    // 0: image
    // 1: color
    if (!this.wallpaperType) {
      styles.backgroundImage = `url(${this.wallpaper})`
    } else if (this.wallpaperType === 1) {
      styles.backgroundColor = this.color
    }

    return styles
  }
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
