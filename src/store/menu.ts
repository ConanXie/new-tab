import { observable, action } from "mobx"

export interface MenuType {
  disabled?: boolean
  icon: React.ReactElement
  text: string
  onClick(e: any): void
}

export class MenuStore {
  @observable public top: number = 0
  @observable public left: number = 0
  @observable public menus: MenuType[] = []

  @action("set position")
  public setPosition = (left: number, top: number) => {
    this.left = left + 1
    this.top = top + 1
  }
  @action("show menu")
  public showMenu = (menus: MenuType[]) => {
    this.menus = menus
  }

  @action("clear menus")
  public clearMenus = () => {
    setTimeout(() => this.menus = [])
  }
}

const menuStore = new MenuStore()

export default menuStore
