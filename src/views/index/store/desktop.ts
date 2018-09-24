import { observable, action, computed } from "mobx"

export interface DataType {
  index: number
  id: string
  name: string
  icon: string
  url: string
}

export class DesktopStore {
  @observable public data: DataType[] = [{
    index: 0,
    id: "wb001",
    name: "Bilibili",
    icon: "bilibili",
    url: "https://www.bilibili.com"
  }, {
    index: 1,
    id: "wb002",
    name: "酷安",
    icon: "coolapk",
    url: "https://www.coolapk.com"
  }, {
    index: 2,
    id: "wb003",
    name: "Google",
    icon: "google",
    url: "https://www.google.com"
  }, {
    index: 3,
    id: "wb004",
    name: "IT之家",
    icon: "ithome",
    url: "https://www.ithome.com"
  }, {
    index: 4,
    id: "wb005",
    name: "京东",
    icon: "jd",
    url: "https://www.jd.com"
  }, {
    index: 6,
    id: "wb007",
    name: "腾讯新闻",
    icon: "qq_news",
    url: "https://www.qq.com"
  }, {
    index: 7,
    id: "wb008",
    name: "Steam",
    icon: "steam",
    url: "https://www.steam.com"
  }, {
    index: 8,
    id: "wb009",
    name: "淘宝",
    icon: "taobao",
    url: "https://www.taobao.com"
  }, {
    index: 9,
    id: "wb010",
    name: "贴吧",
    icon: "tieba",
    url: "https://tieba.baidu.com"
  }, {
    index: 11,
    id: "wb011",
    name: "Youtube",
    icon: "youtube",
    url: "https://www.youtube.com"
  }, {
    index: 12,
    id: "wb013",
    name: "Tmall",
    icon: "tmall",
    url: "https://www.tmall.com"
  }, {
    index: 14,
    id: "wb015",
    name: "Twitter",
    icon: "twitter",
    url: "https://www.twitter.com"
  }, {
    index: 16,
    id: "wb016",
    name: "Quora",
    icon: "quora",
    url: "https://www.quora.com"
  }, {
    index: 19,
    id: "wb014",
    name: "Facebook",
    icon: "facebook",
    url: "https://www.facebook.com"
  }]
  @observable public removed: DataType[] = []

  @computed public get latestRemovedName() {
    return this.removed.length ? this.removed[0].name : ""
  }

  @action("update index")
  public updateIndex = (id: string, index: number) => {
    const i = this.data.findIndex(item => item.id === id)
    this.data[i].index = index
  }

  @action("update info")
  public updateInfo = (id: string, name: string, url: string) => {
    const result = this.data.find(item => item.id === id)
    if (result) {
      result.name = name
      result.url = url
    }
  }

  @action("remove website")
  public removeWebsite = (id: string) => {
    const i = this.data.findIndex(item => item.id === id)
    if (i > -1) {
      const rm = this.data.splice(i, 1)[0]
      this.removed.unshift(rm)
    }
  }

  @action("undo")
  public undo = (all?: boolean) => {
    if (!all) {
      const latest = this.removed.shift()
      if (latest) {
        this.data.push(latest)
      }
    } else {
      this.data = this.data.concat(this.removed)
      setTimeout(() => {
        this.removed = []
      }, 300)
    }
  }
}

const desktopStore = new DesktopStore()

export default desktopStore
