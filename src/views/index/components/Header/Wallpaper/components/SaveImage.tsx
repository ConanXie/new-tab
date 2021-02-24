import React, { FC } from "react"
import storage from "store2"

import Item, { ItemProps } from "./Item"

interface Props extends ItemProps {
  url: string
}

const SaveImage: FC<Props> = (props) => {
  const getSuffix = (type = "image/jpeg") => {
    type = type.match(/image\/(\w+)/)![1]
    return type === "jpeg" ? "jpg" : type
  }
  const saveCurrentWallpaper = () => {
    const suffix = getSuffix(storage.get("image.type"))
    const filename = `mdnt-bg.${suffix}`
    chrome.downloads.download({
      url: props.url,
      filename,
    })
  }
  return (
    <Item
      disabled={props.disabled}
      primary={chrome.i18n.getMessage("wallpaper_download")}
      secondary={chrome.i18n.getMessage("wallpaper_download_descr")}
      onClick={saveCurrentWallpaper}
    />
  )
}

export default SaveImage
