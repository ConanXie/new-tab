import { autorun, toJS, makeAutoObservable } from "mobx"

export const DESKTOP_SETTINGS = "desktop-settings"

export const defaultData = {
  toolbar: true,
  columns: 8,
  rows: 5,
  shortcutLabel: true,
  shortcutLabelColor: "#FFFFFF",
  shortcutLabelShadow: true,
  acrylicContextMenu: false,
  acrylicWallpaperDrawer: false,
}

export class DesktopSettings {
  toolbar = false
  columns = defaultData.columns
  rows = defaultData.rows
  shortcutLabel = defaultData.shortcutLabel
  shortcutLabelColor = defaultData.shortcutLabelColor
  shortcutLabelShadow = defaultData.shortcutLabelShadow
  acrylicContextMenu = defaultData.acrylicContextMenu
  acrylicWallpaperDrawer = defaultData.acrylicWallpaperDrawer

  constructor(self = true) {
    if (self) {
      makeAutoObservable(this, {}, { autoBind: true })
      chrome.storage.local.get(DESKTOP_SETTINGS, this.retrieveCallback)
    }
  }

  get disabledLabelOptions(): boolean {
    return !this.shortcutLabel
  }

  retrieveCallback(result: { [key: string]: any }): void {
    if (result[DESKTOP_SETTINGS]) {
      const {
        toolbar,
        columns,
        rows,
        shortcutLabel,
        shortcutLabelColor,
        shortcutLabelShadow,
        acrylicContextMenu,
        acrylicWallpaperDrawer,
      } = result[DESKTOP_SETTINGS]
      this.toolbar = toolbar !== undefined ? toolbar : defaultData.toolbar
      this.columns = columns !== undefined ? columns : defaultData.columns
      this.rows = rows !== undefined ? rows : defaultData.rows
      this.shortcutLabel = shortcutLabel !== undefined ? shortcutLabel : defaultData.shortcutLabel
      this.shortcutLabelColor =
        shortcutLabelColor !== undefined ? shortcutLabelColor : defaultData.shortcutLabelColor
      this.shortcutLabelShadow =
        shortcutLabelShadow !== undefined ? shortcutLabelShadow : defaultData.shortcutLabelShadow
      this.acrylicContextMenu =
        acrylicContextMenu !== undefined ? acrylicContextMenu : defaultData.acrylicContextMenu
      this.acrylicWallpaperDrawer =
        acrylicWallpaperDrawer !== undefined
          ? acrylicWallpaperDrawer
          : defaultData.acrylicWallpaperDrawer
    } else {
      this.toolbar = defaultData.toolbar
    }
    persist()
  }

  toggleToolbar(): void {
    this.toolbar = !this.toolbar
  }

  updateGrid(columns: number, rows: number): void {
    this.columns = columns
    this.rows = rows
  }

  toggleShortcutLabel(): void {
    this.shortcutLabel = !this.shortcutLabel
  }

  saveShortcutLabelColor(color: string): void {
    this.shortcutLabelColor = color.toUpperCase()
  }

  toggleShortcutLabelShadow(): void {
    this.shortcutLabelShadow = !this.shortcutLabelShadow
  }

  toggleAcrylicContextMenu(): void {
    this.acrylicContextMenu = !this.acrylicContextMenu
  }

  toggleAcrylicWallpaperDrawer(): void {
    this.acrylicWallpaperDrawer = !this.acrylicWallpaperDrawer
  }
}

const desktopSettings = new DesktopSettings()

function persist() {
  let firstrun = true
  autorun(() => {
    const data = toJS(desktopSettings)
    if (firstrun) {
      firstrun = false
    } else {
      chrome.storage.local.set({ [DESKTOP_SETTINGS]: data })
    }
  })
}

export default desktopSettings
