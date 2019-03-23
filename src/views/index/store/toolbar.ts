import { observable, action } from "mobx"

export class ToolbarStore {
  @observable public wallpaperDrawerOpen = false
  @observable public wallpaperDrawerLoaded = false

  @action public loadAndOpenWallpaperDrawer = () => {
    this.wallpaperDrawerLoaded = true
    this.wallpaperDrawerOpen = true
  }
  @action public closeWallpaperDrawer = () => {
    this.wallpaperDrawerOpen = false
  }
}

const toolbarStore = new ToolbarStore()

export default toolbarStore
