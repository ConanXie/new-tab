import { observable, computed, action, autorun, toJS } from "mobx"

export const FOLDERS_SETTINGS = "folders-settings"

export const defaultData = {
  backgroundColor: "#FFFFFF",
  backgroundOpacity: 1,
  acrylicEffect: false,
  shortcutLabel: true,
  shortcutLabelColor: "#202020",
  shortcutLabelShadow: false,
}

export class FoldersSettings {
  @observable public backgroundColor = defaultData.backgroundColor
  @observable public backgroundOpacity = defaultData.backgroundOpacity
  @observable public acrylicEffect = defaultData.acrylicEffect
  @observable public shortcutLabel = defaultData.shortcutLabel
  @observable public shortcutLabelColor = defaultData.shortcutLabelColor
  @observable public shortcutLabelShadow = defaultData.shortcutLabelShadow

  public constructor(self = true) {
    if (self) {
      chrome.storage.local.get(FOLDERS_SETTINGS, (result) => {
        if (result[FOLDERS_SETTINGS]) {
          const {
            backgroundColor,
            backgroundOpacity,
            acrylicEffect,
            shortcutLabel,
            shortcutLabelColor,
            shortcutLabelShadow,
          } = result[FOLDERS_SETTINGS] as typeof defaultData
          this.backgroundColor =
            backgroundColor !== undefined ? backgroundColor : defaultData.backgroundColor
          this.backgroundOpacity =
            backgroundOpacity !== undefined ? backgroundOpacity : defaultData.backgroundOpacity
          this.acrylicEffect =
            acrylicEffect !== undefined ? acrylicEffect : defaultData.acrylicEffect
          this.shortcutLabel =
            shortcutLabel !== undefined ? shortcutLabel : defaultData.shortcutLabel
          this.shortcutLabelColor =
            shortcutLabelColor !== undefined ? shortcutLabelColor : defaultData.shortcutLabelColor
          this.shortcutLabelShadow =
            shortcutLabelShadow !== undefined
              ? shortcutLabelShadow
              : defaultData.shortcutLabelShadow
        }
        // eslint-disable-next-line
        persist()
      })
    }
  }

  @action public saveBackgroundColor = (color: string) => {
    this.backgroundColor = color.toUpperCase()
  }

  @action public saveShortcutLabelColor = (color: string) => {
    this.shortcutLabelColor = color.toUpperCase()
  }

  @action public toggleShortcutLabel = () => {
    this.shortcutLabel = !this.shortcutLabel
  }

  @action public toggleShortcutLabelShadow = () => {
    this.shortcutLabelShadow = !this.shortcutLabelShadow
  }

  @action public toggleAcrylicEffect = () => {
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
