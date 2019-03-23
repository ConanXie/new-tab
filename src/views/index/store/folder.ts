import { observable, action, computed } from "mobx"

import desktopStore, { Desktop, Shortcut } from "./desktop"

export class FolderStore {
  public folderElement?: HTMLElement

  @observable public id: string = ""
  @observable public open: boolean = false
  @observable public component?: Desktop
  @observable public tempShortcut: string = ""
  @observable public shortcuts: Shortcut[] = []

  @computed get gridColumns() {
    return Math.ceil(Math.sqrt(this.shortcuts.length))
  }

  @computed get gridRows() {
    return Math.ceil(this.shortcuts.length / this.gridColumns)
  }

  @action("open folder")
  public openFolder = (id: string, element: HTMLElement, shortcut?: Shortcut) => {
    this.id = id
    this.component = desktopStore.data.find(item => item.id === this.id)
    if (this.component) {
      this.saveTempShortcut(shortcut && shortcut.id)
      this.syncShortcutsFromDesktop()
      if (shortcut) {
        this.pushShortcut(shortcut)
      }
      this.folderElement = element
      this.open = true
    }
  }

  @action("close folder")
  public closeFolder = () => {
    this.open = false
  }

  @action("copy shortcuts")
  public copyShortcuts = () => {
    if (this.component) {
      return this.component.shortcuts!.filter(item => item.id !== this.tempShortcut)
    }
    return []
  }

  @action("push shortcut")
  public pushShortcut = (shortcut: Shortcut) => {
    const index = this.shortcuts.findIndex(item => item.id === shortcut.id)
    if (index === -1) {
      this.shortcuts.push(shortcut)
    } else {
      this.shortcuts.push(this.shortcuts.splice(index, 1)[0])
    }
  }

  @action("save temp shortcut")
  public saveTempShortcut = (shortcutId: string = "") => {
    this.tempShortcut = shortcutId
  }

  @action("sync shortcuts to desktop store")
  public syncShortcuts = (shortcutId: string, index: number) => {
    const origin = this.shortcuts.findIndex(item => item.id === shortcutId)
    this.saveTempShortcut()
    this.shortcuts.splice(index, 0, this.shortcuts.splice(origin, 1)[0])
    if (this.component) {
      this.component.shortcuts = this.shortcuts
    }
  }

  @action("sync shortcuts from desktop store")
  public syncShortcutsFromDesktop = () => {
    this.shortcuts = this.copyShortcuts()
    if (this.updatePopoverPosition) {
      this.updatePopoverPosition()
    }
    if (this.shortcuts.length <= 1) {
      this.open = false
    }
  }

  public updatePopoverPosition?: () => void
}

const folderStore = new FolderStore()

export default folderStore
