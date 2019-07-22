import { observable, action, autorun, toJS } from "mobx"

export const DESKTOP_SETTINGS = "desktop-settings"

export const defaultData = {
  toolbar: true,
  columns: 8,
  rows: 5,
}

export class DesktopSettings {
  @observable public toolbar = false
  @observable public columns = defaultData.columns
  @observable public rows = defaultData.rows

  public constructor(self = true) {
    if (self) {
      chrome.storage.local.get(DESKTOP_SETTINGS, (result) => {
        if (result[DESKTOP_SETTINGS]) {
          const { toolbar, columns, rows } = result[DESKTOP_SETTINGS]
          this.toolbar = toolbar !== undefined ? toolbar : defaultData.toolbar
          this.columns = columns !== undefined ? columns : defaultData.columns
          this.rows = rows !== undefined ? rows : defaultData.rows
        } else {
          this.toolbar = defaultData.toolbar
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        persist()
      })
    }
  }

  @action public toggleToolbar = () => {
    this.toolbar = !this.toolbar
  }

  @action public updateGrid = (columns: number, rows: number) => {
    this.columns = columns
    this.rows = rows
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
