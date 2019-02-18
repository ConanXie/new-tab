import * as React from "react"
import { inject, observer } from "mobx-react"

import { imageAccepts, imageSize } from "config"
import makeDumbProps from "utils/makeDumbProps"
import { WallpaperStore } from "../../store/wallpaper"

interface PropsType {
  wallpaperStore: WallpaperStore
}

@inject("wallpaperStore")
@observer
export class Background extends React.Component<PropsType> {
  private handleDrag = (event: DragEvent) => {
    event.preventDefault()
  }
  private handleDrop = async (event: DragEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.dataTransfer!.files[0]
    const { useWallpaper, updateWallpaper } = this.props.wallpaperStore
    if (file && useWallpaper) {
      const { type, size } = file
      const matched = imageAccepts.find(item => item === type)
      if (!matched || size > imageSize) {
        return
      }
      updateWallpaper(file)
    }
  }
  public componentDidMount() {
    const { body } = document
    body.addEventListener("dragenter", this.handleDrag)
    body.addEventListener("dragover", this.handleDrag)
    body.addEventListener("drop", this.handleDrop)
  }
  public render() {
    const { wallpaperStyles, maskStyles } = this.props.wallpaperStore
    return (
      <React.Fragment>
        <div id="bg" style={wallpaperStyles} />
        <div id="mask" style={maskStyles} />
      </React.Fragment>
    )
  }
}

export default makeDumbProps(Background)
