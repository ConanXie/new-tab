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
      <div data-id={this.props.id} onClick={this.handleClick}>
        <div className="folder-wrap">
          <div ref={this.folderRef} className={classNames("folder", { two: shortcuts.length === 2 })}>
            {shortcuts.map(({ label }, index) => (
              <div key={index}>
                <img src={chrome.runtime.getURL(`icons/google.png`)} alt={label} />
              </div>
            ))}
          </div>
        </div>
        <Typography className="shortcut-name" variant="subtitle1">{this.props.label}</Typography>
      </div>
    )
  }
}

export default Folder
