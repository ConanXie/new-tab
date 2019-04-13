import { observable, action, computed } from "mobx"

import desktopStore, { Shortcut } from "./desktop"
export class WebSiteInfoStore {
  @observable public itemId = ""
  @observable public index = 0
  @observable public open = false

  public defaultInfo: Shortcut = {
    id: "",
    label: "",
    url: "https://",
  }

  @computed public get info(): Shortcut {
    const item = desktopStore.data.find(({ id }) => id === this.itemId)
    return (item && this.index < item.shortcuts!.length && item.shortcuts![this.index]) || this.defaultInfo
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
