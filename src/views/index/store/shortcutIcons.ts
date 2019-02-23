import { observable, action, computed, autorun } from "mobx"
import { sendMessage } from "utils/message"

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
      let icon = this.icons[id]
      if (icon) {
        if (!/data:image\//.test(icon)) {
          icon = chrome.runtime.getURL(`icons/${icon}.png`)
        }
        return icon
      } else {
        sendMessage("getIcons", url, (officialIcons: string[]) => {
          if (officialIcons) {
            this.icons![id] = officialIcons[0]
          }
        })
        return
      }
    }).get()
  }

  @action public updateIcon = (id: string, icon = "") => {
    this.icons![id] = icon
  }
}

const shortcutIconsStore = new ShortcutIconsStore();

(window as any).shortcutIcons = shortcutIconsStore

autorun(() => {
  chrome.storage.local.set(shortcutIconsStore)
})

export default shortcutIconsStore
