import { toJS, observable, computed, makeObservable, action } from "mobx"
import shortid from "shortid"
import desktopSettings from "store/desktopSettings"
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
  widgetName?: string
}

export class DesktopStore {
  data: Desktop[] = [
    {
      type: 2,
      row: 2,
      rowEnd: 3,
      column: 4,
      columnEnd: 6,
      id: "widget001",
      widgetName: "DateTime",
    },
    {
      type: 2,
      row: 2,
      rowEnd: 3,
      column: 6,
      columnEnd: 7,
      id: "widget002",
      widgetName: "Scallop",
    },
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

  /**
   * id of grabbed shortcut, folder or widget
   */
  grabbedId = ""

  cellWidth = 0

  cellHeight = 0

  constructor() {
    makeObservable(
      this,
      {
        data: observable,
        removed: observable,
        cellWidth: observable,
        cellHeight: observable,
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
        updateCell: action,
        updateWidgetSize: action,
      },
      { autoBind: true },
    )

    chrome.storage.local.get([DESKTOP], this.retrieveCallback)
  }
  get chessBoard(): number[][] {
    const arr: number[][] = []
    for (let i = 0; i < desktopSettings.rows; i++) {
      arr[i] = []
      for (let j = 0; j < desktopSettings.columns; j++) {
        arr[i][j] = 0
      }
    }
    this.data.forEach(({ id, row, column, rowEnd, columnEnd, type }) => {
      if (this.grabbedId !== id) {
        rowEnd = rowEnd || row + 1
        columnEnd = columnEnd || column + 1
        if (rowEnd <= desktopSettings.rows && columnEnd <= desktopSettings.columns) {
          for (let i = row - 1; i < rowEnd - 1; i++) {
            for (let j = column - 1; j < columnEnd - 1; j++) {
              arr[i][j] = type
            }
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

  isAreaAvailable(row: number, column: number, rowEnd?: number, columnEnd?: number): boolean {
    if (rowEnd === undefined && columnEnd === undefined) {
      return !this.chessBoard[row][column]
    } else {
      for (let i = row; i < rowEnd!; i++) {
        for (let j = column; j < columnEnd!; j++) {
          if (this.chessBoard[i][j]) {
            return false
          }
        }
      }
      return true
    }
  }

  retrieveCallback(result: { [key: string]: any }): void {
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
    const unitWidth = clientWidth / desktopSettings.columns
    const unitHeight = clientHeight / desktopSettings.rows
    const row = Math.floor((top - desktopOffsetTop) / unitHeight)
    const column = Math.floor(left / unitWidth)
    if (this.chessBoard[row][column]) {
      for (let i = 0; i < desktopSettings.rows; i++) {
        for (let j = 0; j < desktopSettings.columns; j++) {
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
      if (component.type == 2) {
        component.rowEnd = row + component.rowEnd! - component.row
        component.columnEnd = column + component.columnEnd! - component.column
      }
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

  updateCell(width: number, height: number): void {
    this.cellWidth = width
    this.cellHeight = height
  }

  updateWidgetSize(
    id: string,
    rowStart: number,
    rowEnd: number,
    columnStart: number,
    columnEnd: number,
  ) {
    const widget = this.findById(id)
    if (widget) {
      widget.row = rowStart
      widget.rowEnd = rowEnd
      widget.column = columnStart
      widget.columnEnd = columnEnd
    }
  }
}

const desktopStore = new DesktopStore()

export default desktopStore
