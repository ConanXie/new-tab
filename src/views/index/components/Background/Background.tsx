import * as React from "react"
import { inject, observer } from "mobx-react"

import { WallpaperStore } from "../../store/wallpaper"
import makeDumbProps from "utils/makeDumbProps"

interface PropsType {
  wallpaperStore: WallpaperStore
}

@inject("wallpaperStore")
@observer
class Background extends React.Component<PropsType> {
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
