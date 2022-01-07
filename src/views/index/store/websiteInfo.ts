import { makeAutoObservable } from "mobx"

import desktopStore, { Shortcut } from "./desktop"
export class WebSiteInfoStore {
  itemId = ""
  index = 0
  open = false

  defaultInfo: Shortcut = {
    id: "",
    label: "",
    url: "https://",
  }

  constructor(self = true) {
    if (self) {
      makeAutoObservable(this, {}, { autoBind: true })
    }
  }

  get info(): Shortcut {
    const item = desktopStore.data.find(({ id }) => id === this.itemId)
    return (
      (item && this.index < item.shortcuts!.length && item.shortcuts![this.index]) ||
      this.defaultInfo
    )
  }

  openDialog(itemId = "", index = 0): void {
    this.open = true
    this.itemId = itemId
    this.index = index
  }

  closeDialog(): void {
    this.open = false
  }
}

const websiteInfoStore = new WebSiteInfoStore()

export default websiteInfoStore
