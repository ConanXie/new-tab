import React from "react"
import { inject, observer } from "mobx-react"
import makeDumbProps from "utils/makeDumbProps"

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
import { ShortcutIconsStore } from "../../../store/shortcutIcons"

const styles = ({ spacing }: Theme) => createStyles({
  title: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    display: "inline-block",
    marginRight: spacing(2),
    marginLeft: spacing(-0.5),
    background: "none",
  }
})

interface PropsType extends WithStyles<typeof styles> {
  open: boolean
  websiteInfoStore: WebSiteInfoStore
  shortcutIconsStore: ShortcutIconsStore
  onClose(): void
}

@inject("websiteInfoStore", "shortcutIconsStore")
@observer
class WebsiteInfo extends React.Component<PropsType> {
  public state = {}

  public handleClose = () => {
    this.props.websiteInfoStore.open = false
  }

  public render() {
    const { classes } = this.props
    const { open, info } = this.props.websiteInfoStore
    const { shortcutIcon, getURL } = this.props.shortcutIconsStore
    const icon = info.id ? shortcutIcon(info.id, info.url) : ""
    const iconURL = icon ? getURL(icon) : ""

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
      >
        <DialogTitle className={classes.title} disableTypography>
          <Avatar
            className={classes.avatar}
            src={iconURL}
          />
          <Typography variant="h6">{info.label}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{info.url}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleClose}>
            {chrome.i18n.getMessage("button_close")}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default makeDumbProps(withStyles(styles)(WebsiteInfo))
