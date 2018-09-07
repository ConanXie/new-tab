import * as React from "react"

import { WithStyles, StyleRules, withStyles } from "@material-ui/core/styles"
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

const styles: StyleRules = {
  title: {
    "& > h2": {
      display: "flex",
      alignItems: "center"
    }
  },
  avatar: {
    display: "inline-block",
    width: 36,
    height: 36,
    marginRight: 16,
    background: "none",
    "& > img": {
      width: "100%",
      height: "100%",
    }
  }
}

type StylesType = "title" | "avatar"

interface PropsType {
  open: boolean
  onClose(): void
  meta: {
    name: string
    icon: string
    url: string
  },
  websiteInfoStore: WebSiteInfoStore
}

@inject("websiteInfoStore")
@observer
class WebsiteInfo extends React.Component<PropsType & WithStyles<StylesType>> {
  public state = {}

  public handleClose = () => {
    this.props.websiteInfoStore.open = false
  }

  public render() {
    const { open, meta } = this.props.websiteInfoStore

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
      >
        <DialogTitle className={this.props.classes.title}>
          <Avatar className={this.props.classes.avatar}>
            <img src={meta.icon} />
          </Avatar>
          {meta.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{meta.url}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default makeDumbProps(withStyles(styles)(WebsiteInfo))
