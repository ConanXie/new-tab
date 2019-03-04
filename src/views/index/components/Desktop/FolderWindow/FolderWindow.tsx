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
import Wrap from "../Wrap"
import grab, { Env } from "../Website/grab"

const styles = ({ spacing }: Theme) => createStyles({
  window: {
    display: "grid",
    padding: spacing.unit,
    "& > .wrap": {
      padding: spacing.unit * 2,
      height: "auto",
      transition: "transform 0.2s cubic-bezier(0.333, 0, 0, 1)",
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

  public handleGrab = (index: number) => (event: React.MouseEvent<HTMLElement>) => {
    if (event.button === 0) {
      const { id, shortcuts } = this.props.folderStore
      grab(event, shortcuts[index], id, Env.Folder)
    }
  }

  public render() {
    const { open, anchorEl, onClose, folderStore, classes } = this.props

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
          style={{ gridTemplateColumns: `repeat(${folderStore.gridColumns}, 1fr)` }}
        >
          {folderStore.shortcuts.map((shortcut, index) => {
            const { id, label, url } = shortcut
            return (
              <Wrap
                grabbed={folderStore.tempShortcut === shortcut.id}
                row={0}
                column={0}
                key={Math.random()}
              >
                <Website
                  id={id}
                  label={label}
                  url={url}
                  key={id}
                  itemId={folderStore.id}
                  index={index}
                  onMouseDown={this.handleGrab(index)}
                />
              </Wrap>
            )
          })}
        </div>
      </Popover>
    )
  }
}

export default makeDumbProps(withStyles(styles)(FolderWindow))
