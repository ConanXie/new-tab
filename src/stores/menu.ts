import { observable, action } from "mobx"

interface MenuType {
  icon: any
  text: string
  onClick(e: any): void
}

export class MenuStore {
  @observable public top: number = 0
  @observable public left: number = 0
  @observable public menus: MenuType[] = []

  @action("set position")
  public setPosition = (left: number, top: number) => {
    this.left = left
    this.top = top
  }
  @action("show menu")
  public showMenu = (menus: MenuType[]) => {
    this.menus = menus
  }

  @action("clear menus")
  public clearMenus = () => {
    this.menus = []
  }
}

const menuStore = new MenuStore()

export default menuStore
