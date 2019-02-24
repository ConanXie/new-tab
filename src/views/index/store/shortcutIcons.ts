import { observable, action, computed, autorun } from "mobx"
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
        sendMessage("getIcons", url, (builtInIcons: string[]) => {
          if (builtInIcons) {
            this.icons![id] = builtInIcons[0]
          }
        })
        return
      }
    }).get()
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

autorun(() => {
  chrome.storage.local.set(shortcutIconsStore)
})

export default shortcutIconsStore
