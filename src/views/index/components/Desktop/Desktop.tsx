import * as React from "react"
import { inject, observer } from "mobx-react"
import * as Loadable from "react-loadable"

import EditIcon from "@material-ui/icons/Edit"
import InfoIcon from "@material-ui/icons/InfoOutlined"
import ClearIcon from "@material-ui/icons/Clear"

import makeDumbProps from "utils/makeDumbProps"
import grab, { Env } from "./Website/grab"
import { DesktopStore, Shortcut } from "../../store/desktop"
import { WebSiteInfoStore } from "../../store/websiteInfo"
import { WebsiteEditStore } from "../../store/websiteEdit"
import { FolderStore } from "../../store/folder"
import { MenuStore } from "stores/menu"
// import WidgetWrap from "../Widgets/Wrap"
import DateTime from "../Widgets/DateTime"
import Webiste from "./Website"
import Undo from "./Undo"
import Folder from "./Folder"
import Wrap from "./Wrap"
import FolderWindow from "./FolderWindow"

const LazyComponent = Loadable.Map({
  loading: () => null,
  loader: {
    WebsiteInfo: () => import("./WebsiteInfo"),
    WebsiteEdit: () => import("./WebsiteEdit"),
  },
  render(loaded, props) {
    const WebsiteInfo = loaded.WebsiteInfo.default
    const WebsiteEdit = loaded.WebsiteEdit.default
    return (
      <>
        <WebsiteInfo />
        <WebsiteEdit />
      </>
    )
  },
})

interface PropsType {
  desktopStore: DesktopStore
  menuStore: MenuStore
  websiteInfoStore: WebSiteInfoStore
  websiteEditStore: WebsiteEditStore
  folderStore: FolderStore
}
@inject(
  "desktopStore",
  "menuStore",
  "websiteInfoStore",
  "websiteEditStore",
  "folderStore",
)
@observer
class Desktop extends React.Component<PropsType> {
  public state = {
    undoOpen: false,
    menus: [{
      icon: <EditIcon />,
      text: "Edit",
      onClick: () => {
        this.editWebsite()
      }
    }, {
      icon: <InfoIcon />,
      text: "Website info",
      onClick: () => {
        this.showInfo()
      }
    }, {
      icon: <ClearIcon />,
      text: "Remove",
      onClick: () => {
        this.removeWebsite()
      }
    }],
  }
  public id = ""
  public index = 0
  private pageElement: React.RefObject<HTMLDivElement> = React.createRef()
  private handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    switch (event.button) {
      case 0:
        // this.beginGrab(event)
        break
      case 2:
        // this.showMenu(event)
        break
    }
  }
  /* private beginGrab = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    // console.log(event)
    const ele = event.currentTarget
    const current = ele.dataset.id as string
    const wrap = ele.parentNode! as HTMLElement
    const { top, left, width, height } = wrap.getBoundingClientRect()
    const { clientWidth, clientHeight, offsetTop: pageOffsetTop } = this.pageElement.current!
    const downScreenX = event.screenX
    const downScreenY = event.screenY
    const unitWidth = clientWidth / this.state.columns
    const unitHeight = clientHeight / this.state.rows

    let clone: HTMLElement
    let tempRow = Number(ele.dataset.row)
    let tempColumn = Number(ele.dataset.column)
    let tempOccupied: HTMLElement | undefined
    const mouseMove = (evt: MouseEvent) => {
      const moveScreenX = evt.screenX
      const moveScreenY = evt.screenY
      // moved
      if (!clone && (downScreenX !== moveScreenX || downScreenY !== moveScreenY)) {
        const offsetLeft = evt.clientX - left
        const offsetTop = evt.clientY - top

        clone = wrap.cloneNode(true) as HTMLElement
        clone.classList.add("grabbing")
        wrap.setAttribute("aria-grabbed", "true")

        const translateX = evt.clientX - offsetLeft
        const translateY = evt.clientY - offsetTop
        clone.style.width = width + "px"
        clone.style.height = height + "px"
        clone.style.transform = `translate(${translateX}px, ${translateY}px)`

        const moveClone = (e: MouseEvent) => {
          e.preventDefault()
          const transX = e.clientX - offsetLeft
          const transY = e.clientY - offsetTop
          clone.style.transform = `translate(${transX}px, ${transY}px)`

          const x = e.clientX
          const y = e.clientY - pageOffsetTop
          let row: number
          let column: number

          if (x > 0 && x < clientWidth && y > 0 && y < clientHeight) {
            row = Math.ceil(y / unitHeight)
            column = Math.ceil(x / unitWidth)
            if (tempRow !== row || tempColumn !== column) {
              tempRow = row
              tempColumn = column
              if (tempOccupied) {
                tempOccupied.classList.remove("touched")
                tempOccupied = undefined
              }

              const occupied = this.props.desktopStore.getOccupied(tempRow, tempColumn)
              if (occupied) {
                const target = document.querySelector(`[data-id="${occupied.id}"]`)
                if (target && target !== ele) {
                  tempOccupied = target as HTMLElement
                  tempOccupied.classList.add("touched")
                }
              }
            }
          } else {
            tempOccupied = undefined
          }
        }
        document.addEventListener("mousemove", moveClone, false)

        const _mouseUp = (e: MouseEvent) => {
          const x = e.clientX
          const y = e.clientY - pageOffsetTop
          let row: number
          let column: number

          clone.classList.add("grabbed")
          if (x > 0 && x < clientWidth && y > 0 && y < clientHeight) {
            row = Math.ceil(y / unitHeight)
            column = Math.ceil(x / unitWidth)

            const transX = (column - 1) * unitWidth
            const transY = unitHeight * (row - 1) + pageOffsetTop
            clone.style.transform = `translate(${transX}px, ${transY}px)`
          } else {
            clone.style.transform = `translate(${translateX}px, ${translateY}px)`
          }
          clone.addEventListener("transitionend", () => {
            console.log("transitionend")
            if (row !== undefined) {
              this.props.desktopStore.updateArea(current, row, column)
            }
            if (tempOccupied) {
              this.props.desktopStore.createFolder(current, tempOccupied.dataset.id as string)
            }
            wrap.setAttribute("aria-grabbed", "false")
            document.body.removeChild(clone)
          }, false)
          document.removeEventListener("mousemove", moveClone, false)
          document.removeEventListener("mouseup", _mouseUp, false)
        }
        document.addEventListener("mouseup", _mouseUp, false)

        document.body.appendChild(clone)
      }
    }
    ele.addEventListener("mousemove", mouseMove, false)
    const mouseUp = (e: MouseEvent) => {
      ele.removeEventListener("mousemove", mouseMove, false)
      document.removeEventListener("mouseup", mouseUp, false)
    }
    document.addEventListener("mouseup", mouseUp, false)
  } */

  public handleShortcutGrab = (shortcut: Shortcut, componentId: string) => (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0) {
      grab(event, shortcut, componentId, Env.Desktop)
    }
  }
  // private prevent
  private showMenu = (event: React.MouseEvent<HTMLAnchorElement>, id: string, index: number = 0) => {
    event.preventDefault()
    this.id = id
    this.index = index
    this.props.menuStore.setPosition(event.clientX, event.clientY)
    this.props.menuStore.showMenu(this.state.menus)
  }
  public editWebsite = () => {
    this.props.websiteEditStore.openDialog(this.id)
  }
  public showInfo = () => {
    this.props.websiteInfoStore.openDialog(this.id)
  }
  public removeWebsite = () => {
    this.props.desktopStore.removeWebsite(this.id)
    this.setState({ undoOpen: true })
  }
  public closeUndo = () => {
    this.setState({ undoOpen: false })
  }
  public render() {
    const { columns, rows, data } = this.props.desktopStore
    const { open: folderOpen, openFolder, closeFolder, folderElement } = this.props.folderStore
    const styles: React.CSSProperties = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridAutoRows: `calc((100vh - 64px) / ${rows})`,
    }
    return (
      <div className="desktop">
        <div className="page" id="desktop" ref={this.pageElement} style={styles}>
          {data.map(item => {
            const { row, column } = item
            if (item.type === 1) {
              if (item.shortcuts!.length <= 1) {
                const { id, shortcuts } = item
                const {
                  label,
                  url,
                  id: shortcutId,
                } = shortcuts![0]
                return (
                  <Wrap row={row} column={column} key={id}>
                    <Webiste
                      id={shortcutId}
                      label={label}
                      url={url}
                      itemId={id}
                      onMouseDown={this.handleShortcutGrab(shortcuts![0], id)}
                      onContextMenu={this.showMenu}
                    />
                  </Wrap>
                )
              } else {
                const { id } = item
                return (
                  <Wrap row={row} column={column} key={id}>
                    <Folder
                      {...item}
                      onClick={openFolder}
                      onMouseDown={this.handleMouseDown}
                      onContextMenu={this.showMenu}
                    />
                  </Wrap>
                )
              }
            }
            return null
          })}
          <Wrap className="widget-wrap" row={1} column={4} rowEnd={2} columnEnd={6}>
            <DateTime />
          </Wrap>
        </div>
        <LazyComponent />
        <Undo open={this.state.undoOpen} onClose={this.closeUndo} />
        <FolderWindow
          open={folderOpen}
          anchorEl={folderElement}
          onClose={closeFolder}
        />
      </div>
    )
  }
}

export default makeDumbProps(Desktop)
