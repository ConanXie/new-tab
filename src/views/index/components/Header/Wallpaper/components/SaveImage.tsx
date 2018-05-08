import * as React from "react"
import * as shortid from "shortid"

import {
  ListItem,
  ListItemText
} from "material-ui/List"

import { ItemPropsType } from "../types"

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
      <ListItem button disabled={this.props.disabled} onClick={this.saveCurrentWallpaper}>
        <ListItemText
          primary={chrome.i18n.getMessage("wallpaper_download_primary")}
          secondary={chrome.i18n.getMessage("wallpaper_download_secondary")}
        />
      </ListItem>
    )
  }
}

export default SaveImage
