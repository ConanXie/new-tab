import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { imageAccepts, imageSize } from "config"
import { wallpaperStore } from "../../store"

const Background: FC = () => {
  const handleDrag = (event: DragEvent) => {
    event.preventDefault()
  }
  const handleDrop = async (event: DragEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.dataTransfer!.files[0]
    const { useWallpaper, updateWallpaper } = wallpaperStore
    if (file && useWallpaper) {
      const { type, size } = file
      const matched = imageAccepts.find((item) => item === type)
      if (!matched || size > imageSize) {
        return
      }
      updateWallpaper(file)
    }
  }

  useEffect(() => {
    const { body } = document
    body.addEventListener("dragenter", handleDrag)
    body.addEventListener("dragover", handleDrag)
    body.addEventListener("drop", handleDrop)
  }, [])

  const { wallpaperStyles, maskStyles } = wallpaperStore
  return (
    <>
      <div id="bg" style={wallpaperStyles} />
      <div id="mask" style={maskStyles} />
    </>
  )
}

export default observer(Background)
