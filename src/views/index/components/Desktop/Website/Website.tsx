import * as React from "react"

import Typography from "@material-ui/core/Typography"

import { sendMessage } from "utils/message"

interface PropsType {
  id: string
  label: string
  url: string
  onMouseDown(e: any): void
  onContextMenu(e: any, id: string): void
}

class Webiste extends React.Component<PropsType> {
  public state = {}

  public handleContextMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.onContextMenu(event, this.props.id)
  }

  public componentDidMount = () => {
    const { id, url } = this.props
    chrome.storage.local.get(id, result => {
      let icon: string = result[id]
      if (icon) {
        if (!/data:image\//.test(icon)) {
          icon = chrome.runtime.getURL(`icons/${icon}.png`)
        }
        this.setState({ icon })
      } else {
        sendMessage("getIcons", url, (officialIcons: string[]) => {
          this.setState({ icon: chrome.runtime.getURL(`icons/${officialIcons[0]}.png`) })
        })
      }
    })
  }

  public render() {
    const { id, url, label } = this.props
    return (
      <a
        href={url}
        data-id={id}
        onMouseDown={this.props.onMouseDown}
        onContextMenu={this.handleContextMenu}
        className="shortcut"
      >
        <div className="shortcut-icon">
          <img src={this.state.icon} alt={label} />
        </div>
        <Typography className="shortcut-name" variant="subtitle1">{label}</Typography>
      </a>
    )
  }
}

export default Webiste
