import * as React from "react"

import Typography from "@material-ui/core/Typography"

interface PropsType {
  meta: {
    row: number
    column: number
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
    const {
      row,
      column,
      url,
      id,
      src,
      name,
    } = this.props.meta
    return (
      <a
        href={url}
        data-id={id}
        data-row={row}
        data-column={column}
        onMouseDown={this.props.onMouseDown}
        onContextMenu={this.handleContextMenu}
        className="shortcut"
      >
        <div className="shortcut-icon">
          <img src={src} alt={name} />
        </div>
        <Typography className="shortcut-name" variant="subtitle1">{name}</Typography>
      </a>
    )
  }
}

export default Webiste
