import { observable, action, computed } from "mobx"

import desktopStore, { Shortcut } from "./desktop"

export class FolderStore {
  public folderElement: HTMLElement

  @observable public id: string = ""
  @observable public open: boolean = false
  @observable public tempShortcut: string = ""
  @observable public shortcuts: Shortcut[] = []

  @computed get component() {
    return desktopStore.data.find(item => item.id === this.id)
  }

  @computed get gridColumns() {
    return Math.ceil(Math.sqrt(this.shortcuts.length))
  }

  @computed get gridRows() {
    return Math.ceil(this.shortcuts.length / this.gridColumns)
  }

  @action("open folder")
  public openFolder = (id: string, element: HTMLElement) => {
    this.id = id
    this.shortcuts = this.copyShortcuts(id)
    this.folderElement = element
    this.open = true
  }

  @action("close folder")
  public closeFolder = () => {
    this.open = false
  }

  @action("copy shortcuts")
  public copyShortcuts = (id: string) => {

    if (this.component) {
      const shortcuts = this.component.shortcuts as Shortcut[]
      return shortcuts.filter(item => item.id !== this.tempShortcut)
    }
    return []
  }

  @action("remove shortcut")
  public removeShortcut = (shortcutId: string) => {
    /* const index = this.shortcuts.findIndex(item => item.id === shortcutId)
    if (index > -1) {
      console.log("remove from folder")
      this.shortcuts.splice(index, 1)
    } */
  }

  @action("push shortcut")
  public pushShortcut = (shortcut: Shortcut) => {
    const index = this.shortcuts.findIndex(item => item.id === shortcut.id)
    if (index === -1) {
      this.shortcuts.push(shortcut)
    }
  }

  @action
  public saveTempShortcut = (shortcutId: string) => {
    this.tempShortcut = shortcutId
  }

  @action
  public syncShortcuts = (shortcutId: string, index: number) => {
    const origin = this.shortcuts.findIndex(item => item.id === shortcutId)
    this.tempShortcut = ""
    this.shortcuts.splice(index, 0, this.shortcuts.splice(origin, 1)[0])

    this.component!.shortcuts = this.shortcuts
  }
}

const folderStore = new FolderStore()

export default folderStore
