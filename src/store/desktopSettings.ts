import { observable, computed, action, autorun, toJS } from "mobx"

export const DESKTOP_SETTINGS = "desktop-settings"

export const defaultData = {
  toolbar: true,
  columns: 8,
  rows: 5,
  shortcutLabel: true,
  shortcutLabelColor: "#FFFFFF",
  shortcutLabelShadow: true,
}

export class DesktopSettings {
  @observable public toolbar = false
  @observable public columns = defaultData.columns
  @observable public rows = defaultData.rows
  @observable public shortcutLabel = defaultData.shortcutLabel
  @observable public shortcutLabelColor = defaultData.shortcutLabelColor
  @observable public shortcutLabelShadow = defaultData.shortcutLabelShadow

  public constructor(self = true) {
    if (self) {
      chrome.storage.local.get(DESKTOP_SETTINGS, result => {
        if (result[DESKTOP_SETTINGS]) {
          const {
            toolbar,
            columns,
            rows,
            shortcutLabel,
            shortcutLabelColor,
            shortcutLabelShadow,
          } = result[DESKTOP_SETTINGS]
          this.toolbar = toolbar !== undefined ? toolbar : defaultData.toolbar
          this.columns = columns !== undefined ? columns : defaultData.columns
          this.rows = rows !== undefined ? rows : defaultData.rows
          this.shortcutLabel =
            shortcutLabel !== undefined ? shortcutLabel : defaultData.shortcutLabel
          this.shortcutLabelColor =
            shortcutLabelColor !== undefined ? shortcutLabelColor : defaultData.shortcutLabelColor
          this.shortcutLabelShadow =
            shortcutLabelShadow !== undefined
              ? shortcutLabelShadow
              : defaultData.shortcutLabelShadow
        } else {
          this.toolbar = defaultData.toolbar
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        persist()
      })
    }
  }

  @computed public get disabledLabelOptions() {
    return !this.shortcutLabel
  }

  @action public toggleToolbar = () => {
    this.toolbar = !this.toolbar
  }

  @action public updateGrid = (columns: number, rows: number) => {
    this.columns = columns
    this.rows = rows
  }

  @action public toggleShortcutLabel = () => {
    this.shortcutLabel = !this.shortcutLabel
  }

  @action public saveShortcutLabelColor = (color: string) => {
    this.shortcutLabelColor = color.toUpperCase()
  }

  @action public toggleShortcutLabelShadow = () => {
    this.shortcutLabelShadow = !this.shortcutLabelShadow
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
