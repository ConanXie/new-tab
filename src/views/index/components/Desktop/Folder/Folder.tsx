import * as React from "react"
import * as classNames from "classnames"
import { inject, observer } from "mobx-react"

import Typography from "@material-ui/core/Typography"

import makeDumbProps from "utils/makeDumbProps"
import { Desktop } from "../../../store/desktop"
import { ShortcutIconsStore } from "../../../store/shortcutIcons"

interface PropsType extends Desktop {
  shortcutIconsStore: ShortcutIconsStore
  onMouseDown: (e: any) => void
  onClick: (id: string, element: HTMLDivElement) => void
  onContextMenu: (e: any, id: string) => void
}

@inject("shortcutIconsStore")
@observer
class Folder extends React.Component<PropsType> {
  public folderRef: React.RefObject<HTMLDivElement> = React.createRef()

  public handleClick = () => {
    this.props.onClick(this.props.id, this.folderRef.current as HTMLDivElement)
  }

  public render() {
    const shortcuts = this.props.shortcuts!.slice(0, 4)
    const { shortcutIcon, getURL } = this.props.shortcutIconsStore

    return (
      <div data-id={this.props.id} onClick={this.handleClick}>
        <div className="folder-wrap">
          <div ref={this.folderRef} className={classNames("folder", { two: shortcuts.length === 2 })}>
            {shortcuts.map(({ id, label, url }, index) => {
              const iconURL = getURL(shortcutIcon(id, url))
              return (
                <div key={index}>
                  <img src={iconURL} alt={label} />
                </div>
              )
            })}
          </div>
        </div>
        <Typography className="shortcut-name" variant="subtitle1">{this.props.label}</Typography>
      </div>
    )
  }
}

export default makeDumbProps(Folder)
