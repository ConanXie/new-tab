import { observable, action, computed } from "mobx"

import desktopStore, { DataType } from "./desktop"
export class WebSiteInfoStore {
  @observable public id: string = ""
  @observable public open: boolean = false

  @computed get info() {
    return desktopStore.data.find(item => item.id === this.id) || {} as DataType
  }

  @action("open webiste dialog")
  public openDialog = (id: string = "") => {
    this.open = true
    this.id = id
  }
  @action("close webiste dialog")
  public closeDialog = () => this.open = false
}

const websiteInfoStore = new WebSiteInfoStore()

export default websiteInfoStore
