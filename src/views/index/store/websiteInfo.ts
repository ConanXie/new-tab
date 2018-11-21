import { observable, action, computed } from "mobx"

import desktopStore, { Shortcut } from "./desktop"
export class WebSiteInfoStore {
  @observable public id: string = ""
  @observable public index: number = 0
  @observable public open: boolean = false

  @computed get info() {
    const component = desktopStore.data.find(item => item.id === this.id)
    if (component) {
      return component.shortcuts![this.index]
    }
    return {} as Shortcut
  }

  @action("open webiste dialog")
  public openDialog = (id: string = "", index: number = 0) => {
    this.open = true
    this.id = id
    this.index = index
  }
  @action("close webiste dialog")
  public closeDialog = () => this.open = false
}

const websiteInfoStore = new WebSiteInfoStore()

export default websiteInfoStore
