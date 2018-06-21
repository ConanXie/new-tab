import * as React from "react"
import { inject, observer } from "mobx-react"

import makeDumbProps from "utils/makeDumbProps"
import { DesktopStore } from "../../store/desktop"
import ContextMenu from "components/ContextMenu"

interface PropsType {
  desktopStore: DesktopStore
}
@inject("desktopStore")
@observer
class Desktop extends React.Component<PropsType> {
  public state = {
    column: 6,
    row: 4,
    clientX: 0,
    clientY: 0,
    menuOpen: false
  }
  private pageElement: React.RefObject<HTMLDivElement> = React.createRef()
  private handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    switch (event.button) {
      case 0:
        this.beginGrab(event)
        break
      case 2:
        this.showMenu(event)
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
        console.log(offsetX, offsetY)
        clone.style.transform = `translate(${evt.clientX - offsetLeft - offsetX}px, ${evt.clientY - offsetTop - offsetY}px)`

        const moveClone = (e: any) => {
          e.preventDefault()
          clone.style.transform = `translate(${e.clientX - offsetLeft - offsetX}px, ${e.clientY - offsetTop - offsetY}px)`
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
            clone.style.transform = `translate(${ indexColumn * unitWidth }px, ${ unitHeight * indexRow + pageOffsetTop }px)`
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
  private showMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = event
    document.addEventListener("contextmenu", e => e.preventDefault(), false)
    this.setState({
      menuOpen: true,
      clientX,
      clientY
    })
  }
  private handleMenuClose = () => {
    this.setState({ menuOpen: false })
  }
  public render() {
    const { data } = this.props.desktopStore
    const { column, row, menuOpen, clientX, clientY } = this.state
    return (
      <div className="desktop">
        <div className="page" ref={this.pageElement}>
          {data.map(item => {
            const { index, id, name, url, icon } = item
            const src = chrome.runtime.getURL(`icons/${icon}.png`)
            const width = `${100 / column}vw`
            const height = `calc((100vh - 64px) / ${row})`
            const styles = {
              width,
              height,
              transform: `translate(calc(${width}*${index % column}), calc(${height}*${Math.floor(index / column)}))`
            }
            return (
              <div key={id} className="wrap" style={styles}>
                <a href={url} data-id={id} onMouseDown={this.handleMouseDown}>
                  <img src={src} alt={name} />
                  <p>{name}</p>
                </a>
              </div>
            )
          })}
        </div>
        <ContextMenu
          open={menuOpen}
          id="desktop-menu"
          top={clientY}
          left={clientX}
          handleClose={this.handleMenuClose}
        />
      </div>
    )
  }
}

export default makeDumbProps(Desktop)
