import React, { FC } from "react"
import { observer } from "mobx-react-lite"

import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import { Theme } from "@mui/material/styles"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Typography from "@mui/material/Typography"

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
      <DialogTitle className={classes.title}>
        <Avatar className={classes.avatar} src={iconURL} />
        <Typography variant="h6" component="p">{info.label}</Typography>
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
