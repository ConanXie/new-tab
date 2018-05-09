import * as React from "react"

import Item, { ItemPropsType, ItemMethods } from "./Item"

class SelectImage extends React.Component<ItemPropsType & ItemMethods> {
  private imageAccepts: string[] = ["image/png", "image/jpeg", "image/gif", "image/jpg"]
  private imageSize = 10485760 // 10MB

  private fileInput: HTMLInputElement
  // Callback Refs
  private setFileInputRef = (element: HTMLInputElement) => {
    this.fileInput = element
  }
  private openFolder = () => {
    this.fileInput.click()
  }

  /**
   * Validate the file type and size
   */
  private validateImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      // Clear input value
      event.target.value = ""
      if (file) {
        const { type, size } = file
        const matched = this.imageAccepts.find(item => item === type)
        if (!matched) {
          this.props.onError(chrome.i18n.getMessage("desktop_msg_not_supported"))
          return
        }
        if (size > this.imageSize) {
          this.props.onError(chrome.i18n.getMessage("desktop_msg_too_large"))
          return
        }
        this.readImage(file)
      }
    }
  }
  private async readImage(file: File) {
    this.props.onChange(file)
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
          accept={this.imageAccepts.join(",")}
          onChange={this.validateImage}
        />
      </React.Fragment>
    )
  }
}

export default SelectImage
