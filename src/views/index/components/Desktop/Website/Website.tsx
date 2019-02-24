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
  shortcutIconsStore: ShortcutIconsStore
  onMouseDown(e: any): void
  onContextMenu(e: any, id: string): void
}

@inject("shortcutIconsStore")
@observer
class Webiste extends React.Component<PropsType> {
  public state = { icon: "" }

  public handleContextMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.onContextMenu(event, this.props.itemId)
  }

  public render() {
    const { id, url, label, itemId } = this.props
    const { shortcutIcon, getURL } = this.props.shortcutIconsStore
    const iconURL = getURL(shortcutIcon(id, url))

    return (
      <a
        href={url}
        data-id={itemId}
        onMouseDown={this.props.onMouseDown}
        onContextMenu={this.handleContextMenu}
        className="shortcut"
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
