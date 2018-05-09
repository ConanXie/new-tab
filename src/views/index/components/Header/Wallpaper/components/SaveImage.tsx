import * as React from "react"
import * as shortid from "shortid"

import Item, { ItemPropsType } from "./Item"

interface PropsType extends ItemPropsType {
  url: string
}

class SaveImage extends React.Component<PropsType> {
  private saveCurrentWallpaper = () => {
    const a = document.createElement("a")
    a.href = this.props.url
    a.download = shortid.generate() + ".jpg"
    a.click()
  }
  public render() {
    return (
      <Item
        disabled={this.props.disabled}
        primary={chrome.i18n.getMessage("wallpaper_download")}
        secondary={chrome.i18n.getMessage("wallpaper_download_descr")}
        onClick={this.saveCurrentWallpaper}
      />
    )
  }
}

export default SaveImage
