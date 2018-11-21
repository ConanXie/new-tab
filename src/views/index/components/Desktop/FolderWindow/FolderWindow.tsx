import * as React from "react"
import * as classNames from "classnames"
import { observer, inject } from "mobx-react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Popover, { PopoverOrigin } from "@material-ui/core/Popover"
// import Typograph from "@material-ui/core/Typography"

import { FolderStore } from "../../../store/folder"
import makeDumbProps from "utils/makeDumbProps"
import Website from "../Website"

const styles = ({ spacing }: Theme) => createStyles({
  window: {
    display: "grid",
    padding: spacing.unit,
    "& > div": {
      padding: spacing.unit * 2,
      height: "auto",
    },
  },
})

interface PropsType extends WithStyles<typeof styles> {
  open: boolean
  anchorEl: HTMLElement
  onClose: (...args: any[]) => void
  folderStore: FolderStore
}

@inject("folderStore")
@observer
class FolderWindow extends React.Component<PropsType> {
  public readonly origin: PopoverOrigin = {
    vertical: "center",
    horizontal: "center",
  }

  public mock = () => {
    return
  }

  public render() {
    const { open, anchorEl, onClose, folderStore, classes } = this.props
    const columns = Math.max(Math.ceil(folderStore.shortcuts.length / 2), 2)

    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={this.origin}
        transformOrigin={this.origin}
      >
        <div
          className={classNames(["folder-window", classes.window])}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {folderStore.shortcuts.map(shortcut => {
            const meta = {
              row: 0,
              column: 0,
              src: chrome.runtime.getURL(`icons/${shortcut.icon}.png`),
              ...shortcut
            }
            return (
              <Website
                meta={meta}
                key={shortcut.id}
                onMouseDown={this.mock}
                onContextMenu={this.mock}
              />
            )
          })}
        </div>
      </Popover>
    )
  }
}

export default makeDumbProps(withStyles(styles)(FolderWindow))
