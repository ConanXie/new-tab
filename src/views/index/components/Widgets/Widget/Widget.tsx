import React, { FC } from "react"
import { observer } from "mobx-react"

import { desktopSettings, desktopStore } from "../../../store"
import Box from "@mui/material/Box"

interface Props {
  id: string
  col: number
  row: number
  colStart: number
  colEnd: number
  rowStart: number
  rowEnd: number
}

export const Widget: FC<Props> = observer((props) => {
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button !== 0) {
      return
    }
    event.persist()
    const el = event.currentTarget
    const wrap = el.parentNode as HTMLElement
    const desktopEl = document.querySelector<HTMLElement>("#desktop")!
    const { top, left, width, height } = wrap.getBoundingClientRect()
    const { clientWidth, clientHeight, offsetTop: desktopOffsetTop } = desktopEl
    const { screenX: downScreenX, screenY: downScreenY } = event
    let clone: HTMLElement

    const handleMouseMove = (evt: MouseEvent) => {
      const { screenX: moveScreenX, screenY: moveScreenY } = evt
      if (downScreenX !== moveScreenX || downScreenY !== moveScreenY) {
        event.preventDefault()
        evt.preventDefault()

        desktopStore.grabbedId = props.id

        el.removeEventListener("mousemove", handleMouseMove)

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
          const columnSize = clientWidth / desktopSettings.columns
          const rowSize = clientHeight / desktopSettings.rows
          const column = Math.ceil(x / columnSize) - 1
          const row = Math.ceil(y / rowSize) - 1

          const {
            row: cRow,
            column: cColumn,
            rowEnd,
            columnEnd,
          } = desktopStore.data.find((item) => item.id === props.id)!
          if (
            x > 0 &&
            x < clientWidth &&
            y > 0 &&
            y < clientHeight &&
            desktopStore.isAreaAvailable(
              row,
              column,
              row + (rowEnd! - cRow),
              column + (columnEnd! - cColumn),
            )
          ) {
            restricted = false
            const transX = column * columnSize
            const transY = row * rowSize + desktopOffsetTop
            clone.style.transform = `translate(${transX}px, ${transY}px)`
          }
          if (restricted) {
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

    const handleMouseUpOnDocument = () => {
      el.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUpOnDocument)
    }
    document.addEventListener("mouseup", handleMouseUpOnDocument)
  }

  return (
    <Box data-type="widget" data-id={props.id} onMouseDown={handleMouseDown}>
      {props.children}
    </Box>
  )
})
