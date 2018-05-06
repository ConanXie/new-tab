import * as React from "react"

import { ListItem, ListItemText } from "material-ui/List"

import { OnError } from "../types"

interface IPropsType extends OnError {}

class SelectImage extends React.Component<IPropsType> {
  private imageAccepts: string[] = ["image/png", "image/jpeg", "image/gif", "image/jpg"]
  private imageSize = 10485760 // 2MB

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
        <ListItem button onClick={this.openFolder}>
          <ListItemText
            primary={chrome.i18n.getMessage("wallpaper_local_primary")}
            secondary={chrome.i18n.getMessage("wallpaper_local_secondary")}
          />
        </ListItem>
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
