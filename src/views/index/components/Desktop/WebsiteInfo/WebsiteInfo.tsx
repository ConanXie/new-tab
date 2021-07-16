import React, { FC } from "react"
import { observer } from "mobx-react-lite"

import { makeStyles, createStyles } from "@material-ui/core/styles"
import { Theme } from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import Typography from "@material-ui/core/Typography"

import { shortcutIconsStore, websiteInfoStore } from "../../../store"

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    title: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      display: "inline-block",
      marginRight: spacing(2),
      marginLeft: spacing(-0.5),
      background: "none",
    },
  }),
)

const WebsiteInfo: FC = () => {
  const classes = useStyles()

  const handleClose = () => {
    websiteInfoStore.closeDialog()
  }

  const { open, info } = websiteInfoStore
  const { shortcutIcon, getURL } = shortcutIconsStore
  const icon = info.id ? shortcutIcon(info.id, info.url) : ""
  const iconURL = icon ? getURL(icon) : ""

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.title} disableTypography>
        <Avatar className={classes.avatar} src={iconURL} />
        <Typography variant="h6">{info.label}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{info.url}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          {chrome.i18n.getMessage("button_close")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default observer(WebsiteInfo)
