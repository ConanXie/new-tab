import React, { FC, useEffect } from "react"
import { observer, useLocalObservable } from "mobx-react-lite"

import { imageRe, imageSize } from "config"
import { wallpaperStore } from "../../store"

const Background: FC = () => {
  const handleDrag = (event: DragEvent) => {
    event.preventDefault()
  }
  const { wallpaperStyles, maskStyles, useWallpaper, updateWallpaper } = useLocalObservable(
    () => wallpaperStore,
  )

  const handleDrop = async (event: DragEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.dataTransfer!.files[0]
    if (file && useWallpaper) {
      const { type, size } = file
      const matched = imageRe.test(type)
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

  return (
    <>
      <div id="bg" style={wallpaperStyles} />
      <div id="mask" style={maskStyles} />
    </>
  )
}

export default observer(Background)
