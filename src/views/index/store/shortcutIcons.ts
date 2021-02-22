import {
  computed,
  autorun,
  toJS,
  makeAutoObservable,
} from "mobx"
import { sendMessage } from "utils/message"
import { isBase64 } from "utils/validate"

export class ShortcutIconsStore {
  icons: { [key: string]: string } | null = null
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    chrome.storage.local.get("icons", this.retrieveCallback)
  }

  retrieveCallback({ icons }: { [key: string]: any }): void {
    this.icons = icons || {}
  }

  shortcutIcon = (id: string, url: string): string | undefined => {
    return computed(() => {
      if (!this.icons) {
        return
      }
      const icon = this.icons[id]
      if (icon) {
        return icon
      } else {
        this.retrieveIcon(url, (builtIn) => (this.icons![id] = builtIn))
        return
      }
    }).get()
  }

  retrieveIcon(url: string, callback?: (icon: string) => void): void {
    sendMessage("getIcons", url, (builtInIcons: string[]) => {
      if (builtInIcons && callback) {
        callback(builtInIcons[0])
      }
    })
  }

  getURL = (icon?: string): string | undefined =>
    computed(() => {
      return !icon || isBase64(icon) ? icon : chrome.runtime.getURL(`icons/${icon}.png`)
    }).get()

  updateIcon(id: string, icon = ""): void {
    this.icons![id] = icon
  }
}

const shortcutIconsStore = new ShortcutIconsStore()

// A hack to set shortcut icon immediately in DevTool Console
;(window as any).shortcutIcons = shortcutIconsStore

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
