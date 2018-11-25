/**
 * Make shortcut grabable.
 */

import desktopStore, { Shortcut } from "../../../store/desktop"
import folderStore from "../../../store/folder"

type Env = "Desktop" | "Folder" | "Drawer"

/** The environment of the shortcut - desktop, folder or drawer */
let env: Env

export default (event: React.MouseEvent<HTMLElement>, shortcut: Shortcut, componentId: string) => {
  event.preventDefault()
  env = "Folder"

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
      let origin: number

      const moveClone = (e: MouseEvent) => {
        e.preventDefault()
        const transX = e.clientX - offsetLeft
        const transY = e.clientY - offsetTop
        clone.style.transform = `translate(${transX}px, ${transY}px)`

        let x = e.clientX
        let y = e.clientY
        console.log(x, y, pageOffsetTop)

        if (env === "Folder") {
          const folderWindow = wrap.parentNode as HTMLElement
          const { top: wTop, left: wLeft, width: wWidth, height: wHeight } = folderWindow.getBoundingClientRect()
          console.log(x, y, wTop, wLeft, wWidth, wHeight)

          // inner folder window
          if (x > wLeft && x < (wLeft + wWidth) && y > wTop && y < (wTop + wHeight)) {
            const padding = parseInt(window.getComputedStyle(folderWindow, null).getPropertyValue("padding") || "0", 10)
            // console.log(padding)
            // const paddingSide = parseInt(padding, 10) / 2
            const unitWidth = (wWidth - padding * 2) / folderStore.gridColumns
            const unitHeight = (wHeight - padding * 2) / folderStore.gridRows
            // console.log(unitWidth, unitHeight)
            // The cursor coords
            let column = Math.ceil((x - wLeft - padding) / unitWidth)
            let row = Math.ceil((y - wTop - padding) / unitHeight)
            // between 1 and the grid size
            column = Math.min(Math.max(column, 1), folderStore.gridColumns)
            row = Math.min(Math.max(row, 1), folderStore.gridRows)
            // index of cursor
            const landing = (column - 1) + (row - 1) * folderStore.gridColumns
            if (origin === undefined) {
              origin = landing
            }
            console.log("moving", landing, origin)
            for (let i = 0; i < folderStore.shortcuts.length; i++) {
              const child = folderWindow.children[i] as HTMLElement
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
          } else {
            env = "Desktop"
            folderStore.closeFolder()
          }
        } else if (env === "Desktop") {}
      }
      document.addEventListener("mousemove", moveClone, false)

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
