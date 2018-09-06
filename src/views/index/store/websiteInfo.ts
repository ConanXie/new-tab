import { observable, action } from "mobx"

interface MetaType {
  icon: string
  url: string
  name: string
}

export class WebSiteInfoStore {
  @observable public meta: MetaType = {
    icon: "",
    url: "",
    name: ""
  }
  @observable public open: boolean = false

  @action("open webiste info dialog")
  public openDialog = () => this.open = true
  @action("close webiste info dialog")
  public closeDialog = () => this.open = false
}

const websiteInfoStore = new WebSiteInfoStore()

export default websiteInfoStore
