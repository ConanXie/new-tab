import * as React from "react"

import Typography from "@material-ui/core/Typography"

interface PropsType {
  style: React.CSSProperties
  meta: {
    id: string
    url: string
    src: string
    name: string
  }
  onMouseDown(e: any): void
  onContextMenu(e: any, id: string): void
}

class Webiste extends React.Component<PropsType> {
  public state = {}

  public handleContextMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.onContextMenu(event, this.props.meta.id)
  }

  public render() {
    const { url, id, src, name } = this.props.meta
    return (
      <div className="wrap" style={this.props.style}>
        <a
          href={url}
          data-id={id}
          onMouseDown={this.props.onMouseDown}
          onContextMenu={this.handleContextMenu}
        >
          <img src={src} alt={name} />
          <Typography className="shortcut-name" variant="subtitle1">{name}</Typography>
        </a>
      </div>
    )
  }
}

export default Webiste
