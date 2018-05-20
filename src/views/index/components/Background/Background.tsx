import * as React from "react"
import { inject, observer } from "mobx-react"

import { imageAccepts, imageSize } from "config"
import makeDumbProps from "utils/makeDumbProps"
import { toBase64 } from "utils/fileConversions"
import { sendMessage } from "utils/message"
import { WallpaperStore } from "../../store/wallpaper"

interface PropsType {
  wallpaperStore: WallpaperStore
}

@inject("wallpaperStore")
@observer
class Background extends React.Component<PropsType> {
  private handleDrag = (event: DragEvent) => {
    event.preventDefault()
  }
  private handleDrop = async (event: DragEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && this.props.wallpaperStore.useWallpaper) {
      const { type, size } = file
      const matched = imageAccepts.find(item => item === type)
      if (!matched || size > imageSize) {
        return
      }
      const base64 = await toBase64(file)
      sendMessage("saveWallpaper", base64)
    }
  }
  public componentDidMount() {
    const { body } = document
    body.addEventListener("dragenter", this.handleDrag, false)
    body.addEventListener("dragover", this.handleDrag, false)
    body.addEventListener("drop", this.handleDrop, false)
  }
  public render() {
    return (
      <React.Fragment>
        <div id="bg" style={this.props.wallpaperStore.wallpaperStyles} />
        <div id="mask" />
      </React.Fragment>
    )
  }
}

export default makeDumbProps(Background)
