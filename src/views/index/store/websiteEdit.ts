import { action } from "mobx"
import shortid from "shortid"

import { WebSiteInfoStore } from "./websiteInfo"
import desktopStore from "./desktop"
import shortcutIconsStore from "./shortcutIcons"

export class WebsiteEditStore extends WebSiteInfoStore {
  @action("save info")
  public saveInfo = (label: string, url: string, icon: string) => {
    if (!/:\/\//.test(url)) {
      url = "https://" + url
    }
    let { id } = this.info
    if (id) {
      desktopStore.updateInfo(this.itemId, this.index, label, url)
    } else {
      id = shortid.generate()
      desktopStore.createShortcut(id, label, url)
    }
    if (icon) {
      shortcutIconsStore.updateIcon(id, icon)
    }
  }
}

const websiteEditStore  = new WebsiteEditStore()

export default websiteEditStore
