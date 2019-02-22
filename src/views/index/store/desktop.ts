import { observable, action, computed } from "mobx"

export interface Based {
  id: string
}

export interface Shortcut extends Based {
  index?: number
  label: string
  url: string
  icon?: string
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
  label?: string
  shortcuts?: Shortcut[]
}

export class DesktopStore {
  @observable public columns = 8
  @observable public rows = 5
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
  }/*, {
    type: 1,
    row: 1,
    column: 5,
    id: "wb005",
    shortcut: {
      name: "京东",
      icon: "jd",
      url: "https://www.jd.com",
    },
  }, {
    type: 1,
    row: 2,
    column: 1,
    id: "wb007",
    shortcut: {
      name: "腾讯新闻",
      icon: "qq_news",
      url: "https://www.qq.com",
    },
  }, {
    type: 1,
    row: 2,
    column: 2,
    id: "wb008",
    shortcut: {
      name: "Steam",
      icon: "steam",
      url: "https://www.steam.com",
    },
  }, {
    type: 1,
    row: 2,
    column: 3,
    id: "wb009",
    shortcut: {
      name: "淘宝",
      icon: "taobao",
      url: "https://www.taobao.com",
    },
  }, {
    type: 1,
    row: 2,
    column: 4,
    id: "wb010",
    shortcut: {
      name: "贴吧",
      icon: "tieba",
      url: "https://tieba.baidu.com",
    },
  }, {
    type: 1,
    row: 2,
    column: 6,
    id: "wb011",
    shortcut: {
      name: "Youtube",
      icon: "youtube",
      url: "https://www.youtube.com",
    },
  }, {
    type: 1,
    row: 3,
    column: 1,
    id: "wb013",
    shortcut: {
      name: "Tmall",
      icon: "tmall",
      url: "https://www.tmall.com",
    },
  }, {
    type: 1,
    row: 3,
    column: 3,
    id: "wb015",
    shortcut: {
      name: "Twitter",
      icon: "twitter",
      url: "https://www.twitter.com",
    },
  }, {
    type: 1,
    row: 3,
    column: 5,
    id: "wb016",
    shortcut: {
      name: "Quora",
      icon: "quora",
      url: "https://www.quora.com",
    },
  }*/]
  @observable public removed: Desktop[] = []

  @computed public get latestRemovedName() {
    return this.removed.length ? (this.removed[0].shortcuts![0].label) : ""
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
  public updateInfo = (id: string, index: number = 0, name: string, url: string) => {
    const component = this.data.find(item => item.id === id)
    if (component && component.shortcuts) {
      component.shortcuts[index].label = name
      component.shortcuts[index].url = url
    }
  }

  @action("remove website")
  public removeWebsite = (id: string, index = 0) => {
    const i = this.findIndexById(id)
    if (i > -1) {
      const component = this.data[i]
      if (this.data[i].shortcuts!.length <= 1) {
        const rm = this.data.splice(i, 1)[0]
        this.removed.unshift(rm)
      } else {
        const rm = { ...component }
        const shortcut = component.shortcuts!.splice(index, 1)[0]
        shortcut.index = index
        rm.shortcuts = [shortcut]
      }
    }
  }

  @action("undo")
  public undo = (all: boolean = false) => {
    let needToUndo = this.removed
    if (!all) {
      needToUndo = this.removed.splice(-1, 1)
    }
    needToUndo.forEach(item => {
      const i = this.findIndexById(item.id)
      if (i > -1) {
        const shortcut = item.shortcuts![0]
        const index = shortcut.index!
        delete shortcut.index
        this.data[i].shortcuts!.splice(index, 0, shortcut)
      } else {
        this.data.push(item)
      }
    })
    this.removed = []
    /* setTimeout(() => {
    }, 300) */
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
        id: Date.now().toString(),
        type: 1,
        row: targetData.row,
        column: targetData.column,
        shortcuts: [...targetData.shortcuts!, ...currentData.shortcuts!],
      }
      console.log(folderData)
      this.data.splice(targetIndex, 1)
      this.data.splice(targetIndex < currentIndex ? currentIndex - 1 : currentIndex, 1)
      this.data.push(folderData)
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
}

const desktopStore = new DesktopStore()

export default desktopStore
