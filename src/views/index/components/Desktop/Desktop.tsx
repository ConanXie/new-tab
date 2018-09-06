import * as React from "react"
import { inject, observer } from "mobx-react"

import EditIcon from "@material-ui/icons/Edit"
import InfoIcon from "@material-ui/icons/InfoOutlined"
import ClearIcon from "@material-ui/icons/Clear"

import makeDumbProps from "utils/makeDumbProps"
import { DesktopStore } from "../../store/desktop"
import { WebSiteInfoStore } from "../../store/websiteInfo"
import { MenuStore } from "stores/menu"
/* import WidgetWrap from "../Widgets/Wrap"
import DateTime from "../Widgets/DateTime" */
import WebsiteInfo from "./WebsiteInfo"
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
  private beginGrab = (event: any) => {
    event.preventDefault()
    console.log(event.button)
    const ele = event.currentTarget
    const wrap = ele.parentNode
    const { clientWidth, clientHeight, offsetTop: pageOffsetTop } = this.pageElement.current!
    const downScreenX = event.screenX
    const downScreenY = event.screenY
    const { offsetLeft, offsetTop } = ele
    let clone: any
    const mouseMove = (evt: any) => {
      const moveScreenX = evt.screenX
      const moveScreenY = evt.screenY
      if (!clone && (downScreenX !== moveScreenX || downScreenY !== moveScreenY)) {
        // ele.removeEventListener("mousemove", mouseMove, false)

        clone = wrap.cloneNode(true)
        clone.classList.add("grabbing")
        wrap.setAttribute("aria-grabbed", "true")

        const offsetX = evt.offsetX
        const offsetY = evt.offsetY
        // console.log(offsetX, offsetY)
        const translateX = evt.clientX - offsetLeft - offsetX
        const translateY = evt.clientY - offsetTop - offsetY
        clone.style.transform = `translate(${translateX}px, ${translateY}px)`

        const moveClone = (e: any) => {
          e.preventDefault()
          const transX = e.clientX - offsetLeft - offsetX
          const transY = e.clientY - offsetTop - offsetY
          clone.style.transform = `translate(${transX}px, ${transY}px)`
        }
        document.addEventListener("mousemove", moveClone, false)

        const _mouseUp = (e: any) => {
          /* console.log(e.clientX, e.clientY)
          console.log(clientWidth, clientHeight)
          console.log(wrap.offsetTop) */
          const x = e.clientX
          const y = e.clientY - pageOffsetTop
          const unitWidth = clientWidth / this.state.column
          const unitHeight = clientHeight / this.state.row
          // console.log(unitWidth, unitHeight)
          if (x > 0 && x < clientWidth && y > 0 && y < clientHeight) {
            const indexColumn = Math.floor(x / unitWidth)
            const indexRow = Math.floor(y / unitHeight)
            // console.log(indexColumn, indexRow)
            const index = indexRow * this.state.column + indexColumn
            // console.log(index)
            clone.classList.add("grabbed")
            const transX = indexColumn * unitWidth
            const transY = unitHeight * indexRow + pageOffsetTop
            clone.style.transform = `translate(${transX}px, ${transY}px)`
            clone.addEventListener("transitionend", () => {
              // console.log(ele)
              this.props.desktopStore.updateIndex(ele.dataset.id, index)
              wrap.setAttribute("aria-grabbed", "false")
              document.body.removeChild(clone)
            }, false)
          }
          document.removeEventListener("mousemove", moveClone, false)
          // wrap.setAttribute("aria-grabbed", "false")
          // document.body.removeChild(clone)
          document.removeEventListener("mouseup", _mouseUp, false)
        }
        document.addEventListener("mouseup", _mouseUp, false)

        document.body.appendChild(clone)
      }
    }
    ele.addEventListener("mousemove", mouseMove, false)
    const mouseUp = (e: any) => {
      // ele.removeEventListener("mousemove", mouseMove, false)
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
    return (
      <div className="desktop">
        <div className="page" ref={this.pageElement}>
          {data.map(item => {
            const { index, id, name, url, icon } = item
            const src = chrome.runtime.getURL(`icons/${icon}.png`)
            const width = `${100 / column}vw`
            const height = `calc((100vh - 64px) / ${row})`
            const styles: React.CSSProperties = {
              width,
              height,
              transform: `translate(calc(${width}*${index % column}), calc(${height}*${Math.floor(index / column)}))`
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
                styles={styles}
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
        <WebsiteInfo />
      </div>
    )
  }
}

export default makeDumbProps(Desktop)
