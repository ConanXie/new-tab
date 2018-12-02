/**
 * Make shortcut grabable.
 */

import desktopStore, { Shortcut } from "../../../store/desktop"
import folderStore from "../../../store/folder"

export type Env = "Desktop" | "Folder" | "Drawer"

/** The environment of the shortcut - desktop, folder or drawer */
let env: Env

/**
 * Grab shortcut when mousedown and move
 * @param event mouse event
 * @param shortcut data
 * @param componentId component id
 * @param initialEnv the initial envrionment of the shortcut
 */
const grab = (event: React.MouseEvent<HTMLElement>, shortcut: Shortcut, componentId: string, initialEnv: Env) => {
  event.preventDefault()
  env = initialEnv

  const el = event.currentTarget
  const wrap = el.parentNode as HTMLElement
  const desktopEl = document.querySelector("#desktop") as HTMLElement
  const { top, left, width, height } = wrap.getBoundingClientRect()
  const { clientWidth, clientHeight, offsetTop: pageOffsetTop } = desktopEl
  const { screenX: downScreenX, screenY: downScreenY} = event
  /** Shadow of shortcut */
  let clone: HTMLElement
  /** For re-caclute the coords of the new shortcut in folder */
  let cloneEventRef: MouseEvent
  let folderWindow: HTMLElement | undefined
  let folderWindowPadding: number

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
      let lastLanding: number
      let tempOccupied: HTMLElement | undefined
      let tempColumn: number
      let tempRow: number
      let timer: NodeJS.Timeout
      /** To fix folder window scale transition */
      let enterFolderTimer: NodeJS.Timeout | undefined

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
        clone.style.transform = `translate(${transX}px, ${transY}px)`
        if (reCalc) {
          enterFolderTimer = undefined
        }

        const x = e.clientX
        let y = e.clientY

        if (env === "Folder") {
          if (!folderWindow) {
            folderWindow = document.querySelector(".folder-window") as HTMLElement
            const padding = window.getComputedStyle(folderWindow, null).getPropertyValue("padding") || "0"
            folderWindowPadding = parseInt(padding, 10)
          }
          /** Ignore calclute before folder window transition finished */
          if (enterFolderTimer) {
            return
          }
          const { top: wTop, left: wLeft, width: wWidth, height: wHeight } = folderWindow.getBoundingClientRect()
          const relativeX = x - wLeft
          const relativeY = y - wTop
          const { gridColumns, gridRows } = folderStore

          // inside folder window
          if (relativeX > 0 && relativeX < wWidth && relativeY > 0 && relativeY < wHeight) {
            unitWidth = (wWidth - folderWindowPadding * 2) / gridColumns
            unitHeight = (wHeight - folderWindowPadding * 2) / gridRows
            // The cursor coords
            column = Math.ceil((relativeX - folderWindowPadding) / unitWidth)
            row = Math.ceil((relativeY - folderWindowPadding) / unitHeight)
            // between 1 and the grid size
            column = Math.min(Math.max(column, 1), gridColumns)
            row = Math.min(Math.max(row, 1), gridRows)
            // index of cursor
            const landing = (column - 1) + (row - 1) * gridColumns

            if (origin === undefined) {
              origin = lastLanding = landing
            }
            // cursor coords changed
            if (lastLanding !== landing) {
              const start = Math.min(lastLanding, landing, origin)
              const end = Math.max(lastLanding, landing, origin)
              // should moving forward (left and up)
              const forward = landing < origin
              for (let i = start; i <= end; i++) {
                const child = folderWindow.children[i] as HTMLElement
                if (child) {
                  let trX = unitWidth
                  let trY = 0
                  const side = i < origin ? i + 1 : i
                  // edge wrap
                  if (side % gridColumns === 0) {
                    trX = -(gridColumns - 1) * unitWidth
                    trY = unitHeight
                  }
                  // should moving backward (right and down)
                  if (!forward) {
                    trX = trX * -1
                    trY = trY * -1
                  }
                  let transform = `translate(${0}px, ${0}px)`
                  // only those shortcuts should be changed translate position which are between landing and origin
                  // others will be restored
                  if ((forward && i >= landing && i < origin) || (!forward && i <= landing &&  i > origin)) {
                    transform = `translate(${trX}px, ${trY}px)`
                  }
                  child.style.transform = transform
                }
              }
              lastLanding = landing
            }

          } else {
            env = "Desktop"
            folderStore.saveTempShortcut(shortcut.id)
            folderStore.closeFolder()
            folderWindow = undefined
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
                clearTimeout(timer)
              }
              const occupied = desktopStore.getOccupied(row, column)
              if (occupied && occupied.type === 1) {
                const occupiedEl = document.querySelector(`[data-id="${occupied.id}"]`) as HTMLElement
                if (occupiedEl && occupiedEl !== el) {
                  tempOccupied = occupiedEl
                  tempOccupied.classList.add("touched")
                  // Open shortcuts folder
                  if (occupied.shortcuts!.length > 1) {
                    const folderId = occupied.id
                    if (timer) {
                      clearTimeout(timer)
                    }
                    timer = setTimeout(() => {
                      folderStore.openFolder(folderId, occupiedEl.querySelector(".folder") as HTMLElement, shortcut)
                      origin = lastLanding = folderStore.shortcuts.length - 1
                      env = "Folder"
                      // auto calculate coords
                      enterFolderTimer = setTimeout(() => moveClone(cloneEventRef, true), 400)
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
       * Resolve data after moving finished
       * @param e mouseup event
       */
      const mouseUp = (e: MouseEvent) => {
        clearTimeout(timer)
        clone.classList.add("grabbed")
        column--
        row--
        let outerSpace = false
        if (env === "Folder") {
          if (enterFolderTimer) {
            clearTimeout(enterFolderTimer)
          }
          const { gridColumns, gridRows, shortcuts } = folderStore
          folderWindow = document.querySelector(".folder-window") as HTMLElement
          const padding = window.getComputedStyle(folderWindow, null).getPropertyValue("padding") || "0"
          folderWindowPadding = parseInt(padding, 10)
          const { top: wTop, left: wLeft, width: wWidth, height: wHeight } = folderWindow.getBoundingClientRect()
          unitWidth = (wWidth - folderWindowPadding * 2) / gridColumns
          unitHeight = (wHeight - folderWindowPadding * 2) / gridRows

          if (lastLanding >= shortcuts.length - 1) {
            column = (shortcuts.length - 1) % gridColumns
            row = gridRows - 1
          }
          const adjustLeft = (unitWidth - width) / 2
          const adjustTop = (unitHeight - height) / 2
          const transX = column * unitWidth + folderWindowPadding + wLeft
          const transY = row * unitHeight + folderWindowPadding + wTop
          clone.style.transform = `translate(${transX + adjustLeft}px, ${transY + adjustTop}px)`
        } else if (env === "Desktop") {
          const x = e.clientX
          const y = e.clientY - pageOffsetTop
          unitWidth = clientWidth / desktopStore.columns
          unitHeight = clientHeight / desktopStore.rows
          const adjustLeft = (unitWidth - width) / 2
          const adjustTop = (unitHeight - height) / 2
          if (x > 0 && x < clientWidth && y > 0 && y < clientHeight) {
            const transX = column * unitWidth
            const transY = row * unitHeight + pageOffsetTop
            clone.style.transform = `translate(${transX + adjustLeft}px, ${transY + adjustTop}px)`
          } else {
            outerSpace = true
            /** Back to original position */
            if (initialEnv === "Desktop") {
              clone.style.transform = `translate(${translateX + adjustLeft}px, ${translateY + adjustTop}px)`
            } else if (initialEnv === "Folder") {
              const { row: cRow, column: cColumn } = desktopStore.data.find(item => item.id === componentId)!
              const transX = (cColumn - 1) * unitWidth
              const transY = (cRow - 1) * unitHeight + pageOffsetTop
              clone.style.transform = `translate(${transX + adjustLeft}px, ${transY + adjustTop}px)`
            }
          }
        }

        clone.addEventListener("transitionend", () => {
          wrap.setAttribute("aria-grabbed", "false")

          if (env === "Folder") {
            folderStore.syncShortcuts(shortcut.id, row * folderStore.gridColumns + column)
            if (tempOccupied && tempOccupied.dataset.id !== componentId) {
              desktopStore.transferShortcut(componentId, shortcut.id, tempOccupied.dataset.id as string)
            }
          } else if (env === "Desktop") {
            if (!tempOccupied) {
              if (!outerSpace) {
                if (initialEnv === "Folder") {
                  desktopStore.createShortcutComponent(componentId, shortcut.id, row + 1, column + 1)
                } else if (initialEnv === "Desktop") {
                  desktopStore.updateArea(componentId, row + 1, column + 1)
                }
              }
            } else {
              if (tempOccupied.dataset.id !== componentId) {
                if (initialEnv === "Desktop") {
                  desktopStore.createFolder(componentId, tempOccupied.dataset.id as string)
                } else if (initialEnv === "Folder") {
                  desktopStore.transferShortcut(componentId, shortcut.id, tempOccupied.dataset.id as string)
                }
              }
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
}

export default grab
