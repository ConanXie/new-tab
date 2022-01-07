import React, { FC, useRef } from "react"

import Item, { ItemProps, ItemMethods } from "./Item"
import { imageAccepts, imageRe, imageSize } from "config"

const SelectImage: FC<ItemProps & ItemMethods> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFolder = () => {
    fileInputRef.current!.click()
  }

  /**
   * Read image file
   * Validate the file type and size
   */
  const readImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      // Clear input value
      event.target.value = ""
      if (file) {
        const { type, size } = file
        const matched = imageRe.test(type)
        if (!matched) {
          props.onError(chrome.i18n.getMessage("desktop_msg_not_supported"))
          return
        }
        if (size > imageSize) {
          props.onError(chrome.i18n.getMessage("desktop_msg_too_large"))
          return
        }
        props.onChange(file)
      }
    }
  }
  return (
    <>
      <Item
        disabled={props.disabled}
        primary={chrome.i18n.getMessage("wallpaper_disk")}
        secondary={chrome.i18n.getMessage("wallpaper_disk_descr")}
        onClick={openFolder}
      />
      <input
        type="file"
        className="select-image"
        ref={fileInputRef}
        accept={imageAccepts.join(",")}
        onChange={readImage}
      />
    </>
  )
}

export default SelectImage
