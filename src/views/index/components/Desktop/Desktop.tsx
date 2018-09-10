import * as React from "react"
import { inject, observer } from "mobx-react"

import EditIcon from "@material-ui/icons/Edit"
import InfoIcon from "@material-ui/icons/InfoOutlined"
import ClearIcon from "@material-ui/icons/Clear"

import LazilyLoad, { importLazy } from "utils/LazilyLoad"
import makeDumbProps from "utils/makeDumbProps"
import { DesktopStore } from "../../store/desktop"
import { WebSiteInfoStore } from "../../store/websiteInfo"
import { MenuStore } from "stores/menu"
/* import WidgetWrap from "../Widgets/Wrap"
import DateTime from "../Widgets/DateTime" */
import Webiste from "./Website"

interface PropsType {
  desktopStore: DesktopStore
  menuStore: MenuStore,
  websiteInfoStore: WebSiteInfoStore
}
@inject("desktopStore", "menuStore", "websiteInfoStore")
@observer
class Desktop extends React.Component<PropsType> {
  public state = {
    column: 6,
    row: 4,
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
        this.editWebsite()
      }
    }],
  }
  private pageElement: React.RefObject<HTMLDivElement> = React.createRef()
  private handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    switch (event.button) {
      case 0:
        this.beginGrab(event)
        break
      case 2:
        // this.showMenu(event)
        break
    }
  }
  private beginGrab = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    // console.log(event)
    const ele = event.currentTarget
    const wrap = ele.parentNode! as HTMLElement
    const { top, left, width, height } = wrap.getBoundingClientRect()
    const { clientWidth, clientHeight, offsetTop: pageOffsetTop } = this.pageElement.current!
    const downScreenX = event.screenX
    const downScreenY = event.screenY

    let clone: HTMLElement
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
        }
        document.addEventListener("mousemove", moveClone, false)

        const _mouseUp = (e: MouseEvent) => {
          const x = e.clientX
          const y = e.clientY - pageOffsetTop
          const unitWidth = clientWidth / this.state.column
          const unitHeight = clientHeight / this.state.row

          if (x > 0 && x < clientWidth && y > 0 && y < clientHeight) {
            const indexColumn = Math.floor(x / unitWidth)
            const indexRow = Math.floor(y / unitHeight)

            const index = indexRow * this.state.column + indexColumn

            clone.classList.add("grabbed")
            const transX = indexColumn * unitWidth
            const transY = unitHeight * indexRow + pageOffsetTop
            clone.style.transform = `translate(${transX}px, ${transY}px)`

            clone.addEventListener("transitionend", () => {
              this.props.desktopStore.updateIndex(ele.dataset.id as string, index)
              wrap.setAttribute("aria-grabbed", "false")
              document.body.removeChild(clone)
            }, false)
          }
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
  }
  // private prevent
  private showMenu = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    this.props.menuStore.setPosition(event.clientX, event.clientY)
    this.props.menuStore.recordId(id)
    this.props.menuStore.showMenu(this.state.menus)
  }
  public editWebsite = () => {
    console.log("edit website")
  }
  public showInfo = () => {
    const website = this.props.desktopStore.data.find(item => item.id === this.props.menuStore.id)
    if (website) {
      this.props.websiteInfoStore.meta = {
        icon: chrome.runtime.getURL(`icons/${website.icon}.png`),
        url: website.url,
        name: website.name
      }
      this.props.websiteInfoStore.openDialog()
    }
  }
  public render() {
    const { data } = this.props.desktopStore
    const { column, row } = this.state
    const styles: React.CSSProperties = {
      gridTemplateColumns: `repeat(${column}, 1fr)`,
      gridAutoRows: `calc((100vh - 64px) / ${row})`
    }
    return (
      <div className="desktop">
        <div className="page" ref={this.pageElement} style={styles}>
          {data.map(item => {
            const { index, id, name, url, icon } = item
            const src = chrome.runtime.getURL(`icons/${icon}.png`)
            const style: React.CSSProperties = {
              gridArea: `${Math.floor(index / column) + 1} / ${index % column + 1} / auto / auto`
            }
            const meta = {
              name,
              url,
              src,
              id
            }
            return (
              <Webiste
                key={id}
                style={style}
                meta={meta}
                onMouseDown={this.handleMouseDown}
                onContextMenu={this.showMenu}
              />
            )
          })}
          {/* <WidgetWrap style={{
            width: `${100 / column * 3}vw`,
            height: `calc((100vh - 64px) / ${row})`,
            transform: `translate(calc(${`${100 / column}vw`}*${3}), calc(${`calc((100vh - 64px) / ${row})`}*${3}))`
          }}>
          <DateTime />
        </WidgetWrap> */}
        </div>
        <LazilyLoad
          modules={{
            WebsiteInfo: () => importLazy(import("./WebsiteInfo"))
          }}
        >
          {({ WebsiteInfo }: { WebsiteInfo: React.ComponentType }) => (
            <WebsiteInfo />
          )}
        </LazilyLoad>
      </div>
    )
  }
}

export default makeDumbProps(Desktop)
