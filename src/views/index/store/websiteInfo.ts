import { observable, action, computed } from "mobx"

import desktopStore, { Shortcut } from "./desktop"
export class WebSiteInfoStore {
  @observable public itemId: string = ""
  @observable public index: number = 0
  @observable public open: boolean = false

  @computed get info() {
    const item = desktopStore.data.find(({ id }) => id === this.itemId)
    if (item) {
      return item.shortcuts![this.index]
    }
    return {} as Shortcut
  }

  @action("open webiste dialog")
  public openDialog = (itemId: string = "", index: number = 0) => {
    this.open = true
    this.itemId = itemId
    this.index = index
  }
  @action("close webiste dialog")
  public closeDialog = () => this.open = false
}

const websiteInfoStore = new WebSiteInfoStore()

export default websiteInfoStore
