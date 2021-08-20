import React, { FC, useCallback, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import { toJS } from "mobx"
import { observer, useLocalObservable } from "mobx-react"

import Typography from "@material-ui/core/Typography"

import { desktopStore, desktopSettings, folderStore } from "../../../store"
import { Desktop } from "../../../store/desktop"
import Wrap from "../Wrap"
import { useAcrylic } from "styles/acrylic"
import Website from "../Website"
import grab, { Env } from "../Website/grab"
import { useEffect } from "react"

interface Props extends Desktop {
  // onClick: (id: string, element: HTMLDivElement) => void
  className?: string
  style?: React.CSSProperties
}

const Folder: FC<Props> = (props) => {
  const { className, style: propsStyle, shortcuts = [] } = props

  // state of folder opening
  const [open, setOpen] = useState(false)

  const [onTransition, setOnTransition] = useState(false)

  const folderRef = useRef<HTMLDivElement>(null)

  const columns = useMemo(() => Math.ceil(Math.sqrt(shortcuts.length)), [shortcuts])

  const rows = useMemo(() => Math.ceil(shortcuts.length / columns), [shortcuts, columns])

  const acrylic = useAcrylic()

  const folderState = useLocalObservable(() => folderStore)

  const desktopSettingsState = useLocalObservable(() => desktopSettings)

  const labelStyle: React.CSSProperties = useMemo<React.CSSProperties>(
    () => ({
      color: desktopSettingsState.shortcutLabelColor,
    }),
    [desktopSettingsState],
  )

  // dynamic styles of folder container
  const folderStyles = useMemo<React.CSSProperties>(() => {
    const style: React.CSSProperties = {}

    if (open) {
      style.position = "absolute"
      style.margin = "0"
      style.width = `calc(min(max(5.5vw, 48px), 96px) * ${columns} / 0.85 + 4px)`
      style.height = `calc((min(max(5.5vw, 48px), 96px) + 20px) * ${rows} / 0.85 + 4px)`
      style.borderRadius = "16px"
      style.borderColor = "transparent"
      style.boxShadow = `0 2px 8px 0 rgba(0, 0, 0, 0.35)`
    }

    return style
  }, [open, columns, rows])

  // dynamic styles of grid container
  const gridStyles: React.CSSProperties = useMemo(() => {
    const style: React.CSSProperties = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
    }
    if (shortcuts.length > 3 && !open) {
      style.width = `${columns * 50}%`
      style.height = `${rows * 50}%`
    }
    return style
  }, [shortcuts, rows, columns, open])

  // calculate classname of grid
  const gridClassName = useMemo(() => {
    switch (shortcuts.length) {
      case 1:
        return "count-one"
      case 2:
        return "count-double"
      case 3:
        return "count-triple"
      default:
        return "count-quadra"
    }
  }, [shortcuts])

  const handleDocumentClick = useCallback(
    (event: MouseEvent) => {
      // click area out of folder to close folder
      const path = event.composedPath()
      if (path.indexOf(folderRef.current!) === -1) {
        folderState.closeFolder()
        setOnTransition(true)

        // clear listener
        document.removeEventListener("click", handleDocumentClick)
      }
    },
    [folderState],
  )

  useEffect(() => {
    setOpen(folderState.id === props.id)
  }, [folderState.id, props.id])

  function handleFolderClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation()

    // put opening in next event loop which after document click
    // for opening anothor folder immediately
    setTimeout(() => folderState.openFolder(props.id), 0)

    setOnTransition(true)

    document.addEventListener("click", handleDocumentClick)
  }

  const handleGrab = (index: number) => (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0) {
      grab(event, toJS(shortcuts)[index], folderState.id, Env.Folder)
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button !== 0 || open) {
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
      handleFolderClick(event)
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

  return (
    <>
      <div
        ref={folderRef}
        data-id={props.id}
        data-type="folder"
        className={clsx("folder", { open, "on-transition": onTransition }, className, acrylic.root)}
        style={{ ...propsStyle, ...folderStyles }}
        onMouseDown={handleMouseDown}
        onTransitionEnd={() => setOnTransition(false)}
      >
        <div className={clsx("folder-grid", gridClassName)} style={gridStyles}>
          {shortcuts.map(({ id, label, url }, index) => (
            <div key={id}>
              <span>
                <Wrap grabbed={folderState.tempShortcutId === id} row={0} column={0}>
                  <Website
                    inFolder
                    id={id}
                    label={label}
                    url={url}
                    key={id}
                    itemId={folderState.id}
                    index={index}
                    onMouseDown={handleGrab(index)}
                  />
                </Wrap>
              </span>
            </div>
          ))}
        </div>
      </div>
      <Typography
        className={clsx("shortcut-name", { shadow: desktopSettingsState.shortcutLabelShadow })}
        variant="subtitle1"
        style={labelStyle}
      >
        {props.label}
      </Typography>
    </>
  )
}

export default observer(Folder)
