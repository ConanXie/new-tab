import { observable, action, computed, autorun, toJS } from "mobx"
import { sendMessage } from "utils/message"
import { isBase64 } from "utils/validate"

export class ShortcutIconsStore {
  @observable public icons: { [key: string]: string } | null = null
  constructor() {
    chrome.storage.local.get("icons", ({ icons }) => this.icons = icons || {})
  }

  public shortcutIcon = (id: string, url: string) => {
    return computed(() => {
      if (!this.icons) {
        return
      }
      const icon = this.icons[id]
      if (icon) {
        return icon
      } else {
        this.retrieveIcon(url, builtIn => this.icons![id] = builtIn)
        return
      }
    }).get()
  }

  public retrieveIcon = (url: string, callback?: (icon: string) => void) => {
    sendMessage("getIcons", url, (builtInIcons: string[]) => {
      if (builtInIcons && callback) {
        callback(builtInIcons[0])
      }
    })
  }

  public getURL = (icon?: string) => computed(() => {
    return !icon || isBase64(icon) ? icon : chrome.runtime.getURL(`icons/${icon}.png`)
  }).get()

  @action public updateIcon = (id: string, icon = "") => {
    this.icons![id] = icon
  }
}

const shortcutIconsStore = new ShortcutIconsStore();

// A hack to set shortcut icon immediately in DevTool Console
(window as any).shortcutIcons = shortcutIconsStore

let firstrun = true

autorun(() => {
  const data = toJS(shortcutIconsStore)
  if (firstrun) {
    firstrun = false
  } else {
    chrome.storage.local.set(data)
  }
})

export default shortcutIconsStore
