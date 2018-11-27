/**
 * Make shortcut grabable.
 */

import desktopStore, { Shortcut } from "../../../store/desktop"
import folderStore from "../../../store/folder"

type Env = "Desktop" | "Folder" | "Drawer"

/** The environment of the shortcut - desktop, folder or drawer */
let env: Env
let initialEnv: Env

export default (event: React.MouseEvent<HTMLElement>, shortcut: Shortcut, componentId: string) => {
  event.preventDefault()
  env = initialEnv = "Folder"

  // console.log(event)
  const el = event.currentTarget
  const current = el.dataset.id as string
  const wrap = el.parentNode as HTMLElement
  const desktopEl = document.querySelector("#desktop") as HTMLElement
  const { top, left, width, height } = wrap.getBoundingClientRect()
  const { clientWidth, clientHeight, offsetTop: pageOffsetTop } = desktopEl
  const { screenX: downScreenX, screenY: downScreenY} = event
  console.log(current, clientHeight, clientWidth, env)
  let clone: HTMLElement
  let cloneEventRef: MouseEvent

  /** Grab the shortcut */
  const handleMouseMove = (evt: MouseEvent) => {
    const { screenX: moveScreenX, screenY: moveScreenY} = evt
    // begin grab
    if (!clone && (downScreenX !== moveScreenX || downScreenY !== moveScreenY)) {
      el.removeEventListener("mousemove", handleMouseMove, false)
      const offsetLeft = evt.clientX - left
      const offsetTop = evt.clientY - top

      // Create a clone to following mouse moving
      clone = wrap.cloneNode(true) as HTMLElement
      clone.classList.add("grabbing")
      // Hide origin
      wrap.setAttribute("aria-grabbed", "true")

      const translateX = evt.clientX - offsetLeft
      const translateY = evt.clientY - offsetTop
      clone.style.width = width + "px"
      clone.style.height = height + "px"
      clone.style.transform = `translate(${translateX}px, ${translateY}px)`
      let column: number
      let row: number
      let unitWidth: number
      let unitHeight: number
      let origin: number
      let tempOccupied: HTMLElement | undefined
      let tempColumn: number
      let tempRow: number
      let timeout: NodeJS.Timeout

      /**
       * Move the clone on screen
       * @param e mousemove event
       * @param reCalc re-calculate the clone's position
       */
      const moveClone = (e: MouseEvent, reCalc: boolean = false) => {
        e.preventDefault()
        cloneEventRef = e
        const transX = e.clientX - offsetLeft
        const transY = e.clientY - offsetTop
        if (!reCalc) {
          clone.style.transform = `translate(${transX}px, ${transY}px)`
        }

        const x = e.clientX
        let y = e.clientY
        // console.log(x, y, pageOffsetTop)

        if (env === "Folder") {
          const folderWindow = document.querySelector(".folder-window") as HTMLElement
          const { top: wTop, left: wLeft, width: wWidth, height: wHeight } = folderWindow.getBoundingClientRect()
          // console.log(x, y, wTop, wLeft, wWidth, wHeight)

          // inner folder window
          if (x > wLeft && x < (wLeft + wWidth) && y > wTop && y < (wTop + wHeight)) {
            const padding = parseInt(window.getComputedStyle(folderWindow, null).getPropertyValue("padding") || "0", 10)
            // console.log(padding)
            // const paddingSide = parseInt(padding, 10) / 2
            unitWidth = (wWidth - padding * 2) / folderStore.gridColumns
            unitHeight = (wHeight - padding * 2) / folderStore.gridRows
            // console.log(unitWidth, unitHeight)
            // The cursor coords
            column = Math.ceil((x - wLeft - padding) / unitWidth)
            row = Math.ceil((y - wTop - padding) / unitHeight)
            // between 1 and the grid size
            column = Math.min(Math.max(column, 1), folderStore.gridColumns)
            row = Math.min(Math.max(row, 1), folderStore.gridRows)
            // index of cursor
            const landing = (column - 1) + (row - 1) * folderStore.gridColumns
            if (origin === undefined) {
              origin = landing
            }
            // console.log("moving", landing, origin)
            for (let i = 0; i < folderStore.shortcuts.length; i++) {
              const child = folderWindow.children[i] as HTMLElement
              if (child) {
                if (landing < origin) {
                  if (i >= landing && i < origin) {
                    let trX = unitWidth
                    let trY = 0
                    if ((i + 1) % folderStore.gridColumns === 0) {
                      trX = -(folderStore.gridColumns - 1) * unitWidth
                      trY = unitHeight
                    }
                    child.style.transform = `translate(${trX}px, ${trY}px)`
                    continue
                  }
                }
                if (landing > origin) {
                  if (i > origin && i <= landing) {
                    let trX = -unitWidth
                    let trY = 0
                    if (i % folderStore.gridColumns === 0) {
                      trX = (folderStore.gridColumns - 1) * unitWidth
                      trY = -unitHeight
                    }
                    child.style.transform = `translate(${trX}px, ${trY}px)`
                    continue
                  }
                }
                child.style.transform = `translate(${0}px, ${0}px)`
              }
            }
          } else {
            env = "Desktop"
            folderStore.removeShortcut(shortcut.id)
            folderStore.closeFolder()
          }
        } else if (env === "Desktop") {
          y -= pageOffsetTop
          if (x > 0 && x < clientWidth && y > 0 && y < clientHeight) {
            unitWidth = clientWidth / desktopStore.columns
            unitHeight = clientHeight / desktopStore.rows
            row = Math.ceil(y / unitHeight)
            column = Math.ceil(x / unitWidth)
            if (tempRow !== row || tempColumn !== column) {
              tempRow = row
              tempColumn = column
              if (tempOccupied) {
                tempOccupied.classList.remove("touched")
                tempOccupied = undefined
              }
              const occupied = desktopStore.getOccupied(row, column)
              if (occupied && occupied.type === 1) {
                componentId = occupied.id
                const occupiedEl = document.querySelector(`[data-id="${occupied.id}"]`) as HTMLElement
                if (occupiedEl) {
                  tempOccupied = occupiedEl
                  tempOccupied.classList.add("touched")
                  if (occupied.shortcuts!.length > 1) {
                    if (timeout) {
                      clearTimeout(timeout)
                    }
                    timeout = setTimeout(() => {
                      folderStore.saveTempShortcut(shortcut.id)
                      folderStore.openFolder(componentId, occupiedEl.querySelector(".folder") as HTMLElement)
                      folderStore.pushShortcut(shortcut)
                      origin = folderStore.shortcuts.length - 1
                      console.log("origin", origin)
                      env = "Folder"
                      // auto calculate coords
                      setTimeout(() => moveClone(cloneEventRef, true), 300)
                    }, 600)
                  }
                }
              }
            }

          } else {
            if (tempOccupied) {
              tempOccupied.classList.remove("touched")
              tempOccupied = undefined
            }
          }
        }
      }
      document.addEventListener("mousemove", moveClone, false)

      /**
       * Resolve data after move finished
       * @param e mouseup event
       */
      const mouseUp = (e: MouseEvent) => {
        clone.classList.add("grabbed")
        column--
        row--
        let landing: number
        console.log("up", column, row)
        const adjustLeft = (unitWidth - width) / 2
        const adjustTop = (unitHeight - height) / 2
        if (env === "Folder") {
          const folderWindow = document.querySelector(".folder-window") as HTMLElement
          const { top: wTop, left: wLeft } = folderWindow.getBoundingClientRect()
          const padding = parseInt(window.getComputedStyle(folderWindow, null).getPropertyValue("padding") || "0", 10)

          landing = row * folderStore.gridColumns + column
          if (landing >= folderStore.shortcuts.length) {
            column = folderStore.shortcuts.length % folderStore.gridColumns - 1
            row = folderStore.gridRows - 1
          }
          const transX = column * unitWidth + padding + wLeft
          const transY = row * unitHeight + padding + wTop
          clone.style.transform = `translate(${transX + adjustLeft}px, ${transY + adjustTop}px)`
        } else if (env === "Desktop") {
          const x = e.clientX
          const y = e.clientY - pageOffsetTop
          if (x > 0 && x < clientWidth && y > 0 && y < clientHeight) {
            const transX = column * unitWidth
            const transY = row * unitHeight + pageOffsetTop
            clone.style.transform = `translate(${transX + adjustLeft}px, ${transY + adjustTop}px)`
          } else {
            console.log("out")
          }
        }

        clone.addEventListener("transitionend", () => {
          wrap.setAttribute("aria-grabbed", "false")

          console.log("end", column, row)
          if (env === "Folder") {
            folderStore.syncShortcuts(shortcut.id, row * folderStore.gridColumns + column)
          } else if (env === "Desktop") {
            if (!tempOccupied) {
              if (initialEnv === "Folder") {
                desktopStore.createShortcutComponent(componentId, shortcut.id, row + 1, column + 1)
              } else {
                desktopStore.updateArea(componentId, row, column)
              }
            } else {
              desktopStore.createFolder(componentId, tempOccupied.dataset.id as string)
            }
          }

          document.body.removeChild(clone)

          if (tempOccupied) {
            tempOccupied.classList.remove("touched")
            tempOccupied = undefined
          }
        }, false)

        document.removeEventListener("mousemove", moveClone, false)
        document.removeEventListener("mouseup", mouseUp, false)
      }
      document.addEventListener("mouseup", mouseUp, false)

      document.body.appendChild(clone)
    }
  }
  el.addEventListener("mousemove", handleMouseMove, false)

  /** Remove all event listeners */
  const handleMouseUp = () => {
    el.removeEventListener("mousemove", handleMouseMove, false)
    document.removeEventListener("mouseup", handleMouseUp, false)
  }
  document.addEventListener("mouseup", handleMouseUp, false)
  console.log(desktopStore)
}
