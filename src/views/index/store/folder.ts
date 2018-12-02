import { observable, action, computed, transaction } from "mobx"

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
  public openFolder = (id: string, element: HTMLElement, shortcut?: Shortcut) => {
    transaction(() => {
      this.id = id
      if (shortcut) {
        this.saveTempShortcut(shortcut.id)
      } else {
        this.saveTempShortcut()
      }
      this.shortcuts = this.copyShortcuts(id)
      if (shortcut) {
        this.pushShortcut(shortcut)
      }
      this.folderElement = element
      this.open = true
    })
  }

  @action("close folder")
  public closeFolder = () => {
    transaction(() => {
      this.open = false
    })
  }

  @action("copy shortcuts")
  public copyShortcuts = (id: string) => {

    if (this.component) {
      const shortcuts = this.component.shortcuts as Shortcut[]
      return shortcuts.filter(item => item.id !== this.tempShortcut)
    }
    return []
  }

  @action("push shortcut")
  public pushShortcut = (shortcut: Shortcut) => {
    const index = this.shortcuts.findIndex(item => item.id === shortcut.id)
    if (index === -1) {
      this.shortcuts.push(shortcut)
    } else {
      transaction(() => {
        this.shortcuts.push(this.shortcuts.splice(index, 1)[0])
      })
    }
  }

  @action("save temp shortcut")
  public saveTempShortcut = (shortcutId: string = "") => {
    this.tempShortcut = shortcutId
  }

  @action("sync shortcuts to desktop store")
  public syncShortcuts = (shortcutId: string, index: number) => {
    transaction(() => {
      const origin = this.shortcuts.findIndex(item => item.id === shortcutId)
      this.saveTempShortcut()
      this.shortcuts.splice(index, 0, this.shortcuts.splice(origin, 1)[0])
      this.component!.shortcuts = this.shortcuts
    })
  }
}

const folderStore = new FolderStore()

export default folderStore
