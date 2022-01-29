import React, { FC, useCallback, useRef, useState } from "react"
import { observer, useLocalObservable } from "mobx-react"
import { Rnd, RndResizeCallback } from "react-rnd"
import clsx from "clsx"

import ClickAwayListener from "@mui/material/ClickAwayListener"

import { desktopStore, widgetStore } from "../../../store"

export const WidgetResize: FC = observer(() => {
  const rnd = useRef<Rnd>(null)
  const [isResizing, setResizing] = useState(false)

  const desktopState = useLocalObservable(() => desktopStore)
  const widgetState = useLocalObservable(() => widgetStore)

  const { column: colStart, columnEnd: colEnd, row: rowStart, rowEnd } = widgetState.widget!
  const row = rowEnd! - rowStart
  const col = colEnd! - colStart

  const width = desktopState.cellWidth * col
  const height = desktopState.cellHeight * row

  const handleResize: RndResizeCallback = useCallback(
    (e, dir, elementRef, delta) => {
      const actualWidth = width + delta.width
      const actualHeight = height + delta.height

      const unitX = actualWidth / desktopState.cellWidth
      const unitY = actualHeight / desktopState.cellHeight

      let { column: colStart, columnEnd: colEnd, row: rowStart, rowEnd } = widgetState.widget!

      const decimalX = unitX % 1
      const decimalY = unitY % 1

      let intX = unitX | 0
      let intY = unitY | 0

      if (/left/i.test(dir)) {
        if (decimalX > 0.5) {
          intX = intX + 1
        }
        colStart = colEnd! - intX
      }
      if (/top/i.test(dir)) {
        if (decimalY > 0.5) {
          intY = intY + 1
        }
        rowStart = rowEnd! - intY
      }
      if (/right/i.test(dir)) {
        if (decimalX > 0.5) {
          intX = intX + 1
        }
        colEnd = colStart + intX
      }
      if (/bottom/i.test(dir)) {
        if (decimalY > 0.5) {
          intY = intY + 1
        }
        rowEnd = rowStart + intY
      }

      widgetState.updateSize(rowStart, rowEnd!, colStart, colEnd!)
    },
    [isResizing],
  )

  const handleResizeStart = () => {
    setResizing(true)
  }

  const handleResizeStop = () => {
    setResizing(false)
    rnd.current?.updatePosition({
      x: (colStart - 1) * desktopState.cellWidth,
      y: (rowStart - 1) * desktopState.cellHeight,
    })
    rnd.current?.updateSize({
      width: `${width}px`,
      height: `${height}px`,
    })
  }

  return (
    <>
      {widgetState.resizableActive && (
        <ClickAwayListener onClickAway={() => widgetState.resetResizableMode()}>
          <Rnd
            ref={rnd}
            default={{
              x: (colStart - 1) * desktopState.cellWidth,
              y: (rowStart - 1) * desktopState.cellHeight,
              width: `${width}px`,
              height: `${height}px`,
            }}
            minWidth={desktopState.cellWidth}
            minHeight={desktopState.cellHeight}
            disableDragging
            onResizeStart={handleResizeStart}
            onResize={handleResize}
            onResizeStop={handleResizeStop}
            className={clsx("widget-resize-tool", { resizing: isResizing })}
          ></Rnd>
        </ClickAwayListener>
      )}
    </>
  )
})
