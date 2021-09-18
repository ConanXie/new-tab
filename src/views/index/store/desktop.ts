import { toJS, observable, computed, makeObservable, action } from "mobx"
import shortid from "shortid"
import {
  DesktopSettings,
  DESKTOP_SETTINGS,
  defaultData as desktopSettingsDefault,
} from "store/desktopSettings"
// import folderStore from "./folder"
import menuStore from "store/menu"

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
  data: Desktop[] = [
    {
      type: 1,
      row: 4,
      column: 3,
      id: "wb001",
      shortcuts: [
        {
          id: "s001",
          label: "Bilibili",
          url: "https://www.bilibili.com",
        },
      ],
    },
    {
      type: 1,
      row: 4,
      column: 4,
      id: "wb003",
      label: "境外势力",
      shortcuts: [
        {
          id: "s003",
          label: "Steam",
          url: "https://www.steampowered.com",
        },
        {
          id: "s004",
          label: "Youtube",
          url: "https://www.youtube.com",
        },
        {
          id: "s005",
          label: "Twitter",
          url: "https://www.twitter.com",
        },
        {
          id: "s008",
          label: "Amazon",
          url: "https://www.amazon.com",
        },
      ],
    },
    {
      type: 1,
      row: 4,
      column: 5,
      id: "wb004",
      shortcuts: [
        {
          id: "s006",
          label: "豆瓣",
          url: "https://www.douban.com",
        },
      ],
    },
    {
      type: 1,
      row: 4,
      column: 6,
      id: "wb005",
      shortcuts: [
        {
          id: "s007",
          label: "QQ",
          url: "https://www.qq.com",
        },
      ],
    },
  ]
  constructor() {
    super(false)

    makeObservable(
      this,
      {
        data: observable,
        toolbar: observable,
        columns: observable,
        rows: observable,
        shortcutLabel: observable,
        shortcutLabelColor: observable,
        shortcutLabelShadow: observable,
        acrylicContextMenu: observable,
        acrylicWallpaperDrawer: observable,
        removed: observable,
        chessBoard: computed,
        isFilled: computed,
        undoMessage: computed,
        createShortcut: action,
        findUsableArea: action,
        updateArea: action,
        updateInfo: action,
        removeWebsite: action,
        undo: action,
        createFolder: action,
        removeFolder: action,
        updateFolder: action,
        transferShortcut: action,
        createShortcutComponent: action,
        retrieveCallback: action,
      },
      { autoBind: true },
    )

    chrome.storage.local.get([DESKTOP, DESKTOP_SETTINGS], this.retrieveCallback)
  }
  get chessBoard(): number[][] {
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
      if (rowEnd <= this.rows && columnEnd <= this.columns) {
        for (let i = row - 1; i < rowEnd; i++) {
          for (let j = column - 1; j < columnEnd; j++) {
            arr[i][j] = type
          }
        }
      }
    })
    return arr
  }
  get isFilled(): boolean {
    return this.chessBoard.every((m) => m.every((n) => !!n))
  }

  removed: Desktop[] = []
  cachedUndoMessage = ""

  get undoMessage(): string {
    if (this.removed.length) {
      const shortcuts = this.removed[0].shortcuts!
      const { getMessage } = chrome.i18n
      if (shortcuts!.length > 1) {
        if (this.removed[0].label) {
          this.cachedUndoMessage = getMessage("removed_shortcut_or_folder", this.removed[0].label)
        } else {
          this.cachedUndoMessage = getMessage("removed_unnamed_folder", [
            shortcuts![0].label || getMessage("unnamed_shortcut"),
            shortcuts!.length - 1,
          ])
        }
      } else {
        this.cachedUndoMessage = getMessage(
          "removed_shortcut_or_folder",
          shortcuts![0].label || getMessage("unnamed_shortcut"),
        )
      }
    }
    return this.cachedUndoMessage
  }

  retrieveCallback(result: { [key: string]: any }): void {
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
  }

  createShortcut(id: string, label: string, url: string, component?: string): void {
    const shortcut: Shortcut = { id, label, url }
    if (component) {
      // Add to folder
      const folder = this.findById(component)
      if (folder && folder.shortcuts) {
        folder.shortcuts.push(shortcut)
      }
    } else {
      // Add to desktop
      const { left, top } = menuStore
      const [row, column] = this.findUsableArea(left, top)!
      this.data.push({
        type: 1,
        id: shortid.generate(),
        row,
        column,
        shortcuts: [shortcut],
      })
    }
  }

  findUsableArea(left: number, top: number): number[] | undefined {
    const desktopEl = document.querySelector("#desktop") as HTMLElement
    const { clientWidth, clientHeight, offsetTop: desktopOffsetTop } = desktopEl
    const unitWidth = clientWidth / this.columns
    const unitHeight = clientHeight / this.rows
    const row = Math.floor((top - desktopOffsetTop) / unitHeight)
    const column = Math.floor(left / unitWidth)
    if (this.chessBoard[row][column]) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          if (!this.chessBoard[i][j]) {
            return [i + 1, j + 1]
          }
        }
      }
    } else {
      return [row + 1, column + 1]
    }
  }

  updateArea(id: string, row: number, column: number): void {
    const component = this.data.find((item) => item.id === id)
    if (component) {
      component.row = row
      component.column = column
    }
  }

  updateInfo(id: string, index = 0, label: string, url: string): void {
    const component = this.data.find((item) => item.id === id)
    if (component && component.shortcuts) {
      component.shortcuts[index].label = label
      component.shortcuts[index].url = url
    }
  }

  removeWebsite(id: string, index = 0): void {
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
        // folderStore.syncShortcutsFromDesktop()
      }
      this.removed.unshift(rm)
    }
  }

  undo(all = false): void {
    let needToUndo = this.removed
    if (!all) {
      needToUndo = this.removed.splice(0, 1)
    }
    needToUndo.forEach((item) => {
      const i = this.findIndexById(item.id)
      if (i > -1) {
        const shortcut = item.shortcuts![0]
        const index = shortcut.index!
        delete shortcut.index
        this.data[i].shortcuts!.splice(index, 0, shortcut)
        // folderStore.syncShortcutsFromDesktop()
      } else {
        this.data.push(item)
      }
    })
    this.removed = []
  }

  getOccupied(row: number, column: number): Desktop | undefined {
    return this.data.find((item) => row === item.row && column === item.column)
  }

  /**
   * @param current The id of the grabbed shortcut
   * @param target The id of the target shortcut
   */
  createFolder(current: string, target: string): void {
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

  removeFolder(id: string): void {
    const index = this.findIndexById(id)
    if (index >= 0) {
      const rm = toJS(this.data.splice(index, 1)[0])
      this.removed.unshift(rm)
    }
  }

  updateFolder(id: string, label: string): void {
    const index = this.findIndexById(id)
    if (index >= 0) {
      const folder = this.data[index]
      folder.label = label
    }
  }

  transferShortcut(current: string, shortcutId: string, target: string): void {
    const currentIndex = this.findIndexById(current)
    const targetIndex = this.findIndexById(target)
    if (currentIndex > -1 && targetIndex > -1) {
      const { shortcuts } = this.data[currentIndex]
      const shortcutIndex = shortcuts!.findIndex((item) => item.id === shortcutId)
      if (shortcutIndex > -1) {
        const shortcut = shortcuts!.splice(shortcutIndex, 1)[0]
        const targetFolder = this.data[targetIndex].shortcuts
        if (!shortcuts!.length) {
          this.data.splice(currentIndex, 1)
        }
        const checkIndex = targetFolder!.findIndex((item) => item.id === shortcutId)
        if (checkIndex === -1) {
          targetFolder!.push(shortcut)
        }
      }
    }
  }

  createShortcutComponent(current: string, shortcutId: string, row: number, column: number): void {
    const currentIndex = this.findIndexById(current)
    if (currentIndex > -1) {
      const { shortcuts } = this.data[currentIndex]
      const shortcutIndex = shortcuts!.findIndex((item) => item.id === shortcutId)
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

  findIndexById(id: string, origin: any[] = this.data): number {
    return origin.findIndex((item: any) => item.id === id)
  }

  findById(id: string, origin: Desktop[] = this.data): Desktop | undefined {
    return origin.find((item) => item.id === id)
  }
}

const desktopStore = new DesktopStore()

export default desktopStore
