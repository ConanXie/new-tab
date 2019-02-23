import { action } from "mobx"

import { WebSiteInfoStore } from "./websiteInfo"
import desktopStore from "./desktop"

export class WebsiteEditStore extends WebSiteInfoStore {
  @action("save info")
  public saveInfo = (label: string, url: string) => {
    if (!/:\/\//.test(url)) {
      url = "https://" + url
    }
    desktopStore.updateInfo(this.id, this.index, label, url)
  }
}

const websiteEditStore  = new WebsiteEditStore()

export default websiteEditStore
