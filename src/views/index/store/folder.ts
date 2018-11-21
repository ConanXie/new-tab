import { observable, action, computed } from "mobx"

import desktopStore, { Shortcut } from "./desktop"

export class FolderStore {
  public folderElement: HTMLElement

  @observable public id: string = ""
  @observable public open: boolean = false

  @computed get shortcuts() {
    const component = desktopStore.data.find(item => item.id === this.id)

    if (component) {
      return component.shortcuts as Shortcut[]
    }
    return []
  }

  @action("open folder")
  public openFolder = (id: string, element: HTMLElement) => {
    this.id = id
    this.folderElement = element
    this.open = true
  }

  @action("close folder")
  public closeFolder = () => {
    this.open = false
  }
}

const folderStore = new FolderStore()

export default folderStore
