import { observable, action, computed, toJS } from "mobx"
import shortid from "shortid"
import { DesktopSettings, DESKTOP_SETTINGS, defaultData as desktopSettingsDefault } from "store/desktopSettings"
import folderStore from "./folder"

const DESKTOP = "DESKTOP"

export interface Based {
  id: string
}

export interface Shortcut extends Based {
  index?: number
  label: string
  url: string
}

/**
 * @1: website shortcut or folder
 * @2: widget
 */
export type ComponentType = 1 | 2

export interface Desktop extends Based {
  type: ComponentType
  row: number
  column: number
  rowEnd?: number
  columnEnd?: number
  label?: string
  shortcuts?: Shortcut[]
}

export class DesktopStore extends DesktopSettings {
  @observable public data: Desktop[] = [{
    type: 1,
    row: 1,
    column: 1,
    id: "wb001",
    shortcuts: [{
      id: "s001",
      label: "Bilibili",
      url: "https://www.bilibili.com",
    }],
  }, {
    type: 1,
    row: 1,
    column: 2,
    id: "wb002",
    shortcuts: [{
      id: "s002",
      label: "酷安",
      url: "https://www.coolapk.com",
    }],
  }, {
    type: 1,
    row: 2,
    column: 4,
    id: "wb003",
    shortcuts: [{
      id: "s003",
      label: "Google",
      url: "https://www.google.com",
    }, {
      id: "s004",
      label: "Youtube",
      url: "https://www.youtube.com",
    }, {
      id: "s005",
      label: "Facebook",
      url: "https://www.facebook.com",
    }],
  } , {
    type: 1,
    row: 3,
    column: 5,
    id: "wb004",
    shortcuts: [{
      id: "s006",
      label: "Twitter",
      url: "https://www.twitter.com",
    }],
  }]
  constructor() {
    super(false)
    chrome.storage.local.get([DESKTOP, DESKTOP_SETTINGS], (result) => {
      if (result[DESKTOP_SETTINGS]) {
        const { toolbar, columns, rows } = result[DESKTOP_SETTINGS]
        this.toolbar = toolbar !== undefined ? toolbar : desktopSettingsDefault.toolbar
        this.columns = columns !== undefined ? columns : desktopSettingsDefault.columns
        this.rows = rows !== undefined ? rows : desktopSettingsDefault.rows
      } else {
        this.toolbar = desktopSettingsDefault.toolbar
      }
      if (result[DESKTOP]) {
        this.data = result[DESKTOP]
      }
    })
  }
  @computed public get chessBoard() {
    const arr: number[][] = []
    for (let i = 0; i < this.rows; i++) {
      arr[i] = []
      for (let j = 0; j < this.columns; j++) {
        arr[i][j] = 0
      }
    }
    this.data.forEach(({ row, column, rowEnd, columnEnd, type }) => {
      rowEnd = rowEnd || row
      columnEnd = columnEnd || column
      for (let i = row - 1; i < rowEnd; i++) {
        for (let j = column - 1; j < columnEnd; j++) {
          arr[i][j] = type
        }
      }
    })
    return arr
  }

  @observable public removed: Desktop[] = []
  public cachedUndoMessage = ""

  @computed public get undoMessage() {
    if (this.removed.length) {
      const shortcuts = this.removed[0].shortcuts!
      if (shortcuts!.length > 1) {
        this.cachedUndoMessage = this.removed[0].label
          ? chrome.i18n.getMessage("removed_shortcut_or_folder", this.removed[0].label)
          : chrome.i18n.getMessage("removed_unamed_folder", [shortcuts![0].label, shortcuts!.length - 1])
      } else {
        this.cachedUndoMessage = chrome.i18n.getMessage("removed_shortcut_or_folder", shortcuts![0].label)
      }
    }
    return this.cachedUndoMessage
  }

  @action("create shortcut")
  public createShortcut = (id: string, label: string, url: string) => {
    this.data.push({
      type: 1,
      id: shortid.generate(),
      row: 4,
      column: 2,
      shortcuts: [{ id, label, url }],
    })
  }

  @action("update area")
  public updateArea = (id: string, row: number, column: number) => {
    const component = this.data.find(item => item.id === id)
    if (component) {
      component.row = row
      component.column = column
    }
  }

  @action("update info")
  public updateInfo = (id: string, index: number = 0, label: string, url: string) => {
    const component = this.data.find(item => item.id === id)
    if (component && component.shortcuts) {
      component.shortcuts[index].label = label
      component.shortcuts[index].url = url
    }
  }

  @action("remove website")
  public removeWebsite = (id: string, index = 0) => {
    const i = this.findIndexById(id)
    if (i > -1) {
      const component = this.data[i]
      let rm: Desktop
      if (this.data[i].shortcuts!.length <= 1) {
        rm = this.data.splice(i, 1)[0]
      } else {
        rm = toJS(component)
        const shortcut = component.shortcuts!.splice(index, 1)[0]
        shortcut.index = index
        rm.shortcuts = [shortcut]
        folderStore.syncShortcutsFromDesktop()
      }
      this.removed.unshift(rm)
    }
  }

  @action("undo")
  public undo = (all = false) => {
    let needToUndo = this.removed
    if (!all) {
      needToUndo = this.removed.splice(0, 1)
    }
    needToUndo.forEach(item => {
      const i = this.findIndexById(item.id)
      if (i > -1) {
        const shortcut = item.shortcuts![0]
        const index = shortcut.index!
        delete shortcut.index
        this.data[i].shortcuts!.splice(index, 0, shortcut)
        folderStore.syncShortcutsFromDesktop()
      } else {
        this.data.push(item)
      }
    })
    this.removed = []
  }

  @action("get occupied")
  public getOccupied = (row: number, column: number) => {
    return this.data.find(item => row === item.row && column === item.column)
  }

  @action("create a folder")
  /**
   * @param current The id of the grabbed shortcut
   * @param target The id of the target shortcut
   */
  public createFolder = (current: string, target: string) => {
    // console.log(current, target)
    const currentIndex = this.findIndexById(current)
    const targetIndex = this.findIndexById(target)
    if (currentIndex > -1 && targetIndex > -1) {
      const currentData = this.data[currentIndex]
      const targetData = this.data[targetIndex]
      const folderData: Desktop = {
        id: shortid.generate(),
        type: 1,
        row: targetData.row,
        column: targetData.column,
        shortcuts: [...targetData.shortcuts!, ...currentData.shortcuts!],
      }
      this.data.splice(targetIndex, 1)
      this.data.splice(targetIndex < currentIndex ? currentIndex - 1 : currentIndex, 1)
      this.data.push(folderData)
    }
  }

  @action
  public removeFolder = (id: string) => {
    const index = this.findIndexById(id)
    if (index >= 0) {
      const rm = toJS(this.data.splice(index, 1)[0])
      this.removed.unshift(rm)
    }
  }

  @action
  public updateFolder = (id: string, label: string) => {
    const index = this.findIndexById(id)
    if (index >= 0) {
      const folder = this.data[index]
      folder.label = label
    }
  }

  @action
  public transferShortcut = (current: string, shortcutId: string, target: string) => {
    const currentIndex = this.findIndexById(current)
    const targetIndex = this.findIndexById(target)
    if (currentIndex > -1 && targetIndex > -1) {
      const { shortcuts } = this.data[currentIndex]
      const shortcutIndex = shortcuts!.findIndex(item => item.id === shortcutId)
      if (shortcutIndex > -1) {
        const shortcut = shortcuts!.splice(shortcutIndex, 1)[0]
        const targetFolder = this.data[targetIndex].shortcuts
        if (!shortcuts!.length) {
          this.data.splice(currentIndex, 1)
        }
        const checkIndex = targetFolder!.findIndex(item => item.id === shortcutId)
        if (checkIndex === -1) {
          targetFolder!.push(shortcut)
        }
      }
    }
  }

  @action
  public createShortcutComponent = (current: string, shortcutId: string, row: number, column: number) => {
    const currentIndex = this.findIndexById(current)
    if (currentIndex > -1) {
      const { shortcuts } = this.data[currentIndex]
      const shortcutIndex = shortcuts!.findIndex(item => item.id === shortcutId)
      if (shortcutIndex > -1) {
        const shortcut = shortcuts!.splice(shortcutIndex, 1)
        this.data.push({
          id: Date.now().toString(),
          type: 1,
          row,
          column,
          shortcuts: shortcut,
        })
      }
    }
  }

  public findIndexById = (id: string, origin: any[] = this.data) => {
    return origin.findIndex((item: any) => item.id === id)
  }

  public findById = (id: string, origin: any[] = this.data) => {
    return origin.find((item: any) => item.id === id)
  }
}

const desktopStore = new DesktopStore()

export default desktopStore
