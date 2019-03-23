import { observable, action, autorun, toJS } from "mobx"

export const DESKTOP_SETTINGS = "desktop-settings"

export const defaultData = {
  toolbar: true,
  columns: 8,
  rows: 5,
}

export class DesktopSettings {
  @observable public toolbar?: boolean
  @observable public columns = defaultData.columns
  @observable public rows = defaultData.rows

  constructor(self = true) {
    if (self) {
      chrome.storage.local.get(DESKTOP_SETTINGS, (result) => {
        if (result[DESKTOP_SETTINGS]) {
          const { toolbar, columns, rows } = result[DESKTOP_SETTINGS]
          this.toolbar = toolbar !== undefined ? toolbar : defaultData.toolbar
          this.columns = columns !== undefined ? columns : defaultData.columns
          this.rows = rows !== undefined ? rows : defaultData.rows
          persist()
        }
      })
    }
  }

  @action public toggleToolbar = () => {
    this.toolbar = !this.toolbar
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
