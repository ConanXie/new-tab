import { action, computed, makeObservable, observable } from "mobx"
import shortid from "shortid"

import { WebSiteInfoStore } from "./websiteInfo"
import desktopStore from "./desktop"
import shortcutIconsStore from "./shortcutIcons"

export class WebsiteEditStore extends WebSiteInfoStore {
  constructor() {
    super(false)

    makeObservable(
      this,
      {
        itemId: observable,
        index: observable,
        open: observable,
        saveInfo: action,
        info: computed,
        openDialog: action,
        closeDialog: action,
      },
      { autoBind: true },
    )
  }

  saveInfo(label: string, url: string, icon: string): void {
    if (!/:\/\//.test(url)) {
      url = "https://" + url
    }
    let { id } = this.info
    if (id) {
      desktopStore.updateInfo(this.itemId, this.index, label, url)
    } else {
      id = shortid.generate()
      desktopStore.createShortcut(id, label, url, this.itemId)
    }
    if (icon) {
      shortcutIconsStore.updateIcon(id, icon)
    }
  }
}

const websiteEditStore = new WebsiteEditStore()

export default websiteEditStore
