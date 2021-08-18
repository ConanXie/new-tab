import { makeAutoObservable, toJS } from "mobx"

import desktopStore, { Desktop, Shortcut } from "./desktop"

export class FolderStore {
  id = ""
  open = false
  component?: Desktop
  tempShortcutId = ""
  // shortcuts: Shortcut[] = []

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get shortcuts(): Shortcut[] {
    return this.component?.shortcuts ?? []
  }

  get gridColumns(): number {
    return Math.ceil(Math.sqrt(toJS(this.shortcuts).length))
  }

  get gridRows(): number {
    return Math.ceil(toJS(this.shortcuts).length / this.gridColumns)
  }

  openFolder(id: string, shortcut?: Shortcut): void {
    this.id = id
    this.component = desktopStore.data.find((item) => item.id === this.id)
    if (this.component) {
      this.saveTempShortcut(shortcut && shortcut.id)
      // this.syncShortcutsFromDesktop()
      if (shortcut) {
        this.pushShortcut(shortcut)
      }
    }
  }

  closeFolder(): void {
    this.id = ""
  }

  // copyShortcuts(): Shortcut[] {
  //   if (this.component) {
  //     return this.component.shortcuts!.filter((item) => item.id !== this.tempShortcut)
  //   }
  //   return []
  // }

  pushShortcut(shortcut: Shortcut): void {
    const index = this.shortcuts.findIndex((item) => item.id === shortcut.id)
    if (index === -1) {
      this.shortcuts.push(shortcut)
    } else {
      this.shortcuts.push(this.shortcuts.splice(index, 1)[0])
    }
  }

  saveTempShortcut(shortcutId = ""): void {
    this.tempShortcutId = shortcutId
  }

  syncShortcuts(shortcutId: string, index: number): void {
    const origin = this.shortcuts.findIndex((item) => item.id === shortcutId)
    this.saveTempShortcut()
    this.shortcuts.splice(index, 0, this.shortcuts.splice(origin, 1)[0])
    if (this.component) {
      this.component.shortcuts = this.shortcuts
    }
  }

  // syncShortcutsFromDesktop(): void {
  //   this.shortcuts = this.copyShortcuts()
  // }
}

const folderStore = new FolderStore()

export default folderStore
