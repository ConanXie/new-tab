import { makeAutoObservable } from "mobx"

import desktopStore, { Desktop, Shortcut } from "./desktop"

export class FolderStore {
  folderElement?: HTMLElement

  id = ""
  open = false
  component?: Desktop
  tempShortcut = ""
  shortcuts: Shortcut[] = []

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get gridColumns(): number {
    return Math.ceil(Math.sqrt(this.shortcuts.length))
  }

  get gridRows(): number {
    return Math.ceil(this.shortcuts.length / this.gridColumns)
  }

  openFolder(id: string, element: HTMLElement, shortcut?: Shortcut): void {
    this.id = id
    this.component = desktopStore.data.find((item) => item.id === this.id)
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

  closeFolder(): void {
    this.open = false
  }

  copyShortcuts(): Shortcut[] {
    if (this.component) {
      return this.component.shortcuts!.filter((item) => item.id !== this.tempShortcut)
    }
    return []
  }

  pushShortcut(shortcut: Shortcut): void {
    const index = this.shortcuts.findIndex((item) => item.id === shortcut.id)
    if (index === -1) {
      this.shortcuts.push(shortcut)
    } else {
      this.shortcuts.push(this.shortcuts.splice(index, 1)[0])
    }
  }

  saveTempShortcut(shortcutId = ""): void {
    this.tempShortcut = shortcutId
  }

  syncShortcuts(shortcutId: string, index: number): void {
    const origin = this.shortcuts.findIndex((item) => item.id === shortcutId)
    this.saveTempShortcut()
    this.shortcuts.splice(index, 0, this.shortcuts.splice(origin, 1)[0])
    if (this.component) {
      this.component.shortcuts = this.shortcuts
    }
  }

  syncShortcutsFromDesktop(): void {
    this.shortcuts = this.copyShortcuts()
    if (this.updatePopoverPosition) {
      this.updatePopoverPosition()
    }
    if (this.shortcuts.length <= 1) {
      this.open = false
    }
  }

  updatePopoverPosition?: () => void
}

const folderStore = new FolderStore()

export default folderStore
