import { makeAutoObservable } from "mobx"

export class ToolbarStore {
  wallpaperDrawerOpen = false
  wallpaperDrawerLoaded = false

  loadAndOpenWallpaperDrawer(): void {
    this.wallpaperDrawerLoaded = true
    this.wallpaperDrawerOpen = true
  }
  closeWallpaperDrawer(): void {
    this.wallpaperDrawerOpen = false
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}

const toolbarStore = new ToolbarStore()

export default toolbarStore
