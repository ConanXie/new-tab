import * as React from "react"
import { inject, observer } from "mobx-react"

import Typography from "@material-ui/core/Typography"

import makeDumbProps from "utils/makeDumbProps"
import { ShortcutIconsStore } from "../../../store/shortcutIcons"

interface PropsType {
  id: string
  label: string
  url: string
  itemId: string
  index?: number
  icon?: string
  shortcutIconsStore: ShortcutIconsStore
  onMouseDown(e: any): void
}

@inject("shortcutIconsStore")
@observer
class Webiste extends React.Component<PropsType> {
  public render() {
    const { id, url, label, itemId, icon, index } = this.props
    const { shortcutIcon, getURL } = this.props.shortcutIconsStore
    const iconURL = icon || getURL(shortcutIcon(id, url))

    return (
      <a
        href={url}
        data-id={itemId}
        data-index={index}
        onMouseDown={this.props.onMouseDown}
        className="shortcut"
        data-type="shortcut"
      >
        <div className="shortcut-icon">
          {iconURL && <img src={iconURL} alt={label} />}
        </div>
        <Typography className="shortcut-name" variant="subtitle1">{label}</Typography>
      </a>
    )
  }
}

export default makeDumbProps(Webiste)
