import { makeAutoObservable } from "mobx"

enum DrawerType {
  Wallpaper = "Wallpaper",
  Widget = "Widget",
}

export class ToolbarStore {
  drawerOpen = false

  drawerType: DrawerType = DrawerType.Widget

  get isWallpaperDrawer(): boolean {
    return this.drawerType === DrawerType.Wallpaper
  }

  get isWidgetDrawer(): boolean {
    return this.drawerType === DrawerType.Widget
  }

  openDrawer(type: DrawerType): void {
    this.drawerType = type
    this.drawerOpen = true
  }

  closeDrawer(): void {
    this.drawerOpen = false
  }

  openWallpaperDrawer() {
    this.openDrawer(DrawerType.Wallpaper)
  }

  openWidgetDrawer() {
    this.openDrawer(DrawerType.Widget)
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}

const toolbarStore = new ToolbarStore()

export default toolbarStore
