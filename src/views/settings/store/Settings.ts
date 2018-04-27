import { observable } from "mobx"

const themeColor = localStorage.getItem("theme") || "#3F51B5"

export class Settings {
  @observable public themeColor = themeColor
  public saveThemeColor(color: string) {
    this.themeColor = color
  }
}

export default new Settings()
