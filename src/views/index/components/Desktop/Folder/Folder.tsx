import * as React from "react"
import * as classNames from "classnames"

import Typography from "@material-ui/core/Typography"
import { Desktop } from "../../../store/desktop"

interface PropsType extends Desktop {
  onMouseDown: (e: any) => void
  onClick: (id: string, element: HTMLDivElement) => void
  onContextMenu: (e: any, id: string) => void
}

class Folder extends React.Component<PropsType> {
  public folderRef: React.RefObject<HTMLDivElement> = React.createRef()

  public handleClick = () => {
    this.props.onClick(this.props.id, this.folderRef.current as HTMLDivElement)
  }

  public render() {
    const shortcuts = this.props.shortcuts!.slice(0, 4)
    return (
      <div
        className="wrap"
        aria-grabbed="false"
        onClick={this.handleClick}
      >
        <div>
          <div ref={this.folderRef} className={classNames("folder", { two: shortcuts.length === 2 })}>
            {shortcuts.map(({ icon, name }, index) => (
              <div key={index}>
                <img src={chrome.runtime.getURL(`icons/${icon}.png`)} alt={name} />
              </div>
            ))}
          </div>
          <Typography className="shortcut-name" variant="subtitle1">{this.props.name}</Typography>
        </div>
      </div>
    )
  }
}

export default Folder
