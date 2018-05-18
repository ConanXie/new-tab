import * as React from "react"
import * as shortid from "shortid"
import * as storage from "store2"

import Item, { ItemPropsType } from "./Item"

interface PropsType extends ItemPropsType {
  url: string
}

class SaveImage extends React.Component<PropsType> {
  private getSuffix(type: string = "image/jpeg") {
    type = type.match(/image\/(\w+)/)![1]
    return type === "jpeg" ? "jpg" : type
  }
  private saveCurrentWallpaper = () => {
    const id = shortid.generate().toLowerCase()
    const suffix = this.getSuffix(storage.get("image.type"))
    const a = document.createElement("a")
    a.href = this.props.url
    a.download = `material-design-new-tab-${id}.${suffix}`
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
