import { autorun, toJS, makeAutoObservable } from "mobx"

export const FOLDERS_SETTINGS = "folders-settings"

export const defaultData = {
  followNightMode: true,
  backgroundColor: "#FFFFFF",
  backgroundOpacity: 1,
  acrylicEffect: false,
  shortcutLabel: true,
  shortcutLabelColor: "#202020",
  shortcutLabelShadow: false,
}

export class FoldersSettings {
  followNightMode = defaultData.followNightMode
  backgroundColor = defaultData.backgroundColor
  backgroundOpacity = defaultData.backgroundOpacity
  acrylicEffect = defaultData.acrylicEffect
  shortcutLabel = defaultData.shortcutLabel
  shortcutLabelColor = defaultData.shortcutLabelColor
  shortcutLabelShadow = defaultData.shortcutLabelShadow

  constructor(self = true) {
    makeAutoObservable(this, {}, { autoBind: true })

    if (self) {
      chrome.storage.local.get(FOLDERS_SETTINGS, this.retrieveCallback)
    }
  }

  retrieveCallback(result: { [key: string]: any }): void {
    if (result[FOLDERS_SETTINGS]) {
      const {
        followNightMode,
        backgroundColor,
        backgroundOpacity,
        acrylicEffect,
        shortcutLabel,
        shortcutLabelColor,
        shortcutLabelShadow,
      } = result[FOLDERS_SETTINGS] as typeof defaultData
      this.followNightMode =
        followNightMode !== undefined ? followNightMode : defaultData.followNightMode
      this.backgroundColor =
        backgroundColor !== undefined ? backgroundColor : defaultData.backgroundColor
      this.backgroundOpacity =
        backgroundOpacity !== undefined ? backgroundOpacity : defaultData.backgroundOpacity
      this.acrylicEffect = acrylicEffect !== undefined ? acrylicEffect : defaultData.acrylicEffect
      this.shortcutLabel = shortcutLabel !== undefined ? shortcutLabel : defaultData.shortcutLabel
      this.shortcutLabelColor =
        shortcutLabelColor !== undefined ? shortcutLabelColor : defaultData.shortcutLabelColor
      this.shortcutLabelShadow =
        shortcutLabelShadow !== undefined ? shortcutLabelShadow : defaultData.shortcutLabelShadow
    }
    persist()
  }

  toggleFollowNightMode(): void {
    this.followNightMode = !this.followNightMode
  }

  saveBackgroundColor(color: string): void {
    this.backgroundColor = color.toUpperCase()
  }

  saveShortcutLabelColor(color: string): void {
    this.shortcutLabelColor = color.toUpperCase()
  }

  toggleShortcutLabel(): void {
    this.shortcutLabel = !this.shortcutLabel
  }

  toggleShortcutLabelShadow(): void {
    this.shortcutLabelShadow = !this.shortcutLabelShadow
  }

  toggleAcrylicEffect(): void {
    this.acrylicEffect = !this.acrylicEffect
  }
}

const foldersSettings = new FoldersSettings()

function persist() {
  let firstrun = true
  autorun(() => {
    const data = toJS(foldersSettings)
    if (firstrun) {
      firstrun = false
    } else {
      chrome.storage.local.set({ [FOLDERS_SETTINGS]: data })
    }
  })
}

export default foldersSettings
