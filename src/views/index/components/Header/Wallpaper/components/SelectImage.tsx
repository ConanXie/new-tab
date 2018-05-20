import * as React from "react"

import Item, { ItemPropsType, ItemMethods } from "./Item"
import { imageAccepts, imageSize } from "config"

class SelectImage extends React.Component<ItemPropsType & ItemMethods> {

  private fileInput: HTMLInputElement
  // Callback Refs
  private setFileInputRef = (element: HTMLInputElement) => {
    this.fileInput = element
  }
  private openFolder = () => {
    this.fileInput.click()
  }

  /**
   * Read image file
   * Validate the file type and size
   */
  private readImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      // Clear input value
      event.target.value = ""
      if (file) {
        const { type, size } = file
        const matched = imageAccepts.find(item => item === type)
        if (!matched) {
          this.props.onError(chrome.i18n.getMessage("desktop_msg_not_supported"))
          return
        }
        if (size > imageSize) {
          this.props.onError(chrome.i18n.getMessage("desktop_msg_too_large"))
          return
        }
        this.props.onChange(file)
      }
    }
  }
  public render() {
    return (
      <React.Fragment>
        <Item
          disabled={this.props.disabled}
          primary={chrome.i18n.getMessage("wallpaper_disk")}
          secondary={chrome.i18n.getMessage("wallpaper_disk_descr")}
          onClick={this.openFolder}
        />
        <input
          type="file"
          className="select-image"
          ref={this.setFileInputRef}
          accept={imageAccepts.join(",")}
          onChange={this.readImage}
        />
      </React.Fragment>
    )
  }
}

export default SelectImage
