import * as React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Typography from "@material-ui/core/Typography"

const styles = (theme: Theme) => createStyles({})

interface PropsType extends WithStyles<typeof styles> {
  icon: string
  open: boolean
  onclose: (event: React.SyntheticEvent<{}>) => void
}

class ShortcutIcon extends React.Component<PropsType> {
  private readonly SIZE = 192

  public handleClose = (event: React.SyntheticEvent<{}>) => {
    this.props.onclose(event)
  }
  public render() {
    const { open, icon } = this.props

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
      >
        <DialogTitle>Icon Editor</DialogTitle>
        <DialogContent>
          <img src={chrome.runtime.getURL(`icons/${icon}.png`)} alt=""/>
          <div className="cropper">
          <Typography variant="h1">{this.SIZE}x{this.SIZE}</Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button>{chrome.i18n.getMessage("button_done")}</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(ShortcutIcon)
