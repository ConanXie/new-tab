import React, { FC, useRef } from "react"
import classNames from "classnames"
import { observer } from "mobx-react-lite"

import Typography from "@material-ui/core/Typography"

import { desktopStore, shortcutIconsStore, desktopSettings } from "../../../store"
import { Desktop } from "../../../store/desktop"

interface Props extends Desktop {
  onClick: (id: string, element: HTMLDivElement) => void
}

const textShadow = "0 1px 2px rgba(0, 0, 0, 0.36)"

const Folder: FC<Props> = (props) => {
  const folderRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button !== 0) {
      return
    }
    event.persist()
    const el = event.currentTarget
    const wrap = el.parentNode as HTMLElement
    const desktopEl = document.querySelector("#desktop") as HTMLElement
    const { top, left, width, height } = wrap.getBoundingClientRect()
    const { clientWidth, clientHeight, offsetTop: desktopOffsetTop } = desktopEl
    const { screenX: downScreenX, screenY: downScreenY } = event
    let clone: HTMLElement

    const handleMouseUp = () => {
      props.onClick(props.id, folderRef.current as HTMLDivElement)
    }
    const handleMouseMove = (evt: MouseEvent) => {
      const { chessBoard } = desktopStore
      const { screenX: moveScreenX, screenY: moveScreenY } = evt
      if (downScreenX !== moveScreenX || downScreenY !== moveScreenY) {
        event.preventDefault()
        evt.preventDefault()

        el.removeEventListener("mousemove", handleMouseMove)
        el.removeEventListener("mouseup", handleMouseUp)

        clone = wrap.cloneNode(true) as HTMLElement
        clone.classList.add("grabbing")
        // Hide original
        wrap.setAttribute("aria-grabbed", "true")

        const offsetLeft = evt.clientX - left
        const offsetTop = evt.clientY - top

        const translateX = evt.clientX - offsetLeft
        const translateY = evt.clientY - offsetTop

        clone.style.width = width + "px"
        clone.style.height = height + "px"
        clone.style.transform = `translate(${translateX}px, ${translateY}px)`

        const handleMouseMoveOnDocument = (e: MouseEvent) => {
          e.preventDefault()
          const transX = e.clientX - offsetLeft
          const transY = e.clientY - offsetTop
          clone.style.transform = `translate(${transX}px, ${transY}px)`
        }
        document.addEventListener("mousemove", handleMouseMoveOnDocument)

        const handleMouseUpOnDoc = (e: MouseEvent) => {
          clone.classList.add("grabbed")
          let restricted = true
          const x = e.clientX
          const y = e.clientY - desktopOffsetTop
          const columnSize = clientWidth / desktopStore.columns
          const rowSize = clientHeight / desktopStore.rows
          const column = Math.ceil(x / columnSize) - 1
          const row = Math.ceil(y / rowSize) - 1

          if (x > 0 && x < clientWidth && y > 0 && y < clientHeight && !chessBoard[row][column]) {
            restricted = false
            const transX = column * columnSize
            const transY = row * rowSize + desktopOffsetTop
            clone.style.transform = `translate(${transX}px, ${transY}px)`
          }
          if (restricted) {
            const { row: cRow, column: cColumn } = desktopStore.data.find(
              (item) => item.id === props.id,
            )!
            const transX = (cColumn - 1) * columnSize
            const transY = (cRow - 1) * rowSize + desktopOffsetTop
            clone.style.transform = `translate(${transX}px, ${transY}px)`
          }

          clone.addEventListener("transitionend", () => {
            wrap.setAttribute("aria-grabbed", "false")
            document.body.removeChild(clone)

            if (!restricted) {
              desktopStore.updateArea(props.id, row + 1, column + 1)
            }
          })

          document.removeEventListener("mousemove", handleMouseMoveOnDocument)
          document.removeEventListener("mouseup", handleMouseUpOnDoc)
        }
        document.addEventListener("mouseup", handleMouseUpOnDoc)

        document.body.appendChild(clone)
      }
    }
    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseup", handleMouseUp)

    const handleMouseUpOnDocument = () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseup", handleMouseUpOnDocument)
    }
    document.addEventListener("mouseup", handleMouseUpOnDocument)
  }

  const shortcuts = props.shortcuts!.slice(0, 4)
  const { shortcutIcon, getURL } = shortcutIconsStore
  const style: React.CSSProperties = {
    color: desktopSettings.shortcutLabelColor,
    textShadow: desktopSettings.shortcutLabelShadow ? textShadow : undefined,
  }

  return (
    <div data-id={props.id} data-type="folder" onMouseDown={handleMouseDown}>
      <div className="folder-wrap">
        <div
          ref={folderRef}
          className={classNames("folder", {
            two: shortcuts.length === 2,
            three: shortcuts.length === 3,
          })}
        >
          {shortcuts.map(({ id, label, url }, index) => {
            const iconURL = getURL(shortcutIcon(id, url))
            return (
              iconURL && (
                <div key={index}>
                  <img src={iconURL} alt={label} />
                </div>
              )
            )
          })}
        </div>
      </div>
      <Typography className="shortcut-name" variant="subtitle1" style={style}>
        {props.label}
      </Typography>
    </div>
  )
}

export default observer(Folder)
