import { makeAutoObservable } from "mobx"

export interface MenuType {
  disabled?: boolean
  icon: React.ReactElement
  text: string
  onClick(e: any): void
}

export class MenuStore {
  top = 0
  left = 0
  menus: MenuType[] = []

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  setPosition(left: number, top: number): void {
    this.left = left + 1
    this.top = top + 1
  }

  showMenu(menus: MenuType[]): void {
    this.menus = menus
  }

  clearMenus(): void {
    setTimeout(() => this.showMenu([]))
  }
}

const menuStore = new MenuStore()

export default menuStore
