import * as React from "react"

import { WithStyles, withStyles } from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"

import { WebSiteInfoStore } from "../../../store/websiteInfo"
import { inject, observer } from "mobx-react"
import makeDumbProps from "utils/makeDumbProps"

const styles = withStyles({
  title: {
    "& > h2": {
      display: "flex",
      alignItems: "center"
    }
  },
  avatar: {
    display: "inline-block",
    marginRight: 16,
    background: "none",
  }
})

type StylesType = "title"
  | "avatar"

interface PropsType extends WithStyles<StylesType> {
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
        <DialogTitle className={classes.title}>
          <Avatar
            className={classes.avatar}
            src={chrome.runtime.getURL(`icons/${info.icon}.png`)}
          />
          {info.name}
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

export default makeDumbProps(styles(WebsiteInfo))
