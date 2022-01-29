import { makeAutoObservable } from "mobx"

import desktopStore from "./desktop"

export class WidgetStore {
  widgetId = ""
  resizableActive = false

  get widget() {
    return desktopStore.findById(this.widgetId)
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  activeResizableMode(widgetId = ""): void {
    this.resizableActive = true
    this.widgetId = widgetId
  }

  resetResizableMode(): void {
    this.resizableActive = false
  }

  updateSize(rowStart: number, rowEnd: number, columnStart: number, columnEnd: number): void {
    desktopStore.updateWidgetSize(this.widgetId, rowStart, rowEnd, columnStart, columnEnd)
  }
}

const widgetStore = new WidgetStore()

export default widgetStore
