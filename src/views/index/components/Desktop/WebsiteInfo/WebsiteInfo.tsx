import * as React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import Typography from "@material-ui/core/Typography"

import { WebSiteInfoStore } from "../../../store/websiteInfo"
import { inject, observer } from "mobx-react"

const styles = ({ spacing }: Theme) => createStyles({
  title: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    display: "inline-block",
    marginRight: spacing.unit * 2,
    marginLeft: -spacing.unit / 2,
    background: "none",
  }
})

interface PropsType extends WithStyles<typeof styles> {
  open: boolean
  onClose(): void
  websiteInfoStore: WebSiteInfoStore
}

@inject("websiteInfoStore")
@observer
class WebsiteInfo extends React.Component<PropsType> {
  public state = {}

  public handleClose = () => {
    this.props.websiteInfoStore.open = false
  }

  public render() {
    const { classes } = this.props
    const { open, info } = this.props.websiteInfoStore

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
      >
        <DialogTitle className={classes.title} disableTypography>
          <Avatar
            className={classes.avatar}
            src={chrome.runtime.getURL(`icons/${info.icon}.png`)}
          />
          <Typography variant="h6">{info.name}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{info.url}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose}>
            {chrome.i18n.getMessage("button_close")}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(WebsiteInfo)
