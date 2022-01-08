import React, { FC } from "react"
import { observer } from "mobx-react-lite"

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Typography from "@mui/material/Typography"

import { shortcutIconsStore, websiteInfoStore } from "../../../store"

const WebsiteInfo: FC = () => {

  const handleClose = () => {
    websiteInfoStore.closeDialog()
  }

  const { open, info } = websiteInfoStore
  const { shortcutIcon, getURL } = shortcutIconsStore
  const icon = info.id ? shortcutIcon(info.id, info.url) : ""
  const iconURL = icon ? getURL(icon) : ""

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          src={iconURL}
          sx={{
            display: "inline-block",
            marginRight: 2,
            marginLeft: -0.5,
          }}
        />
        <Typography variant="h6" component="p">
          {info.label}
        </Typography>
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
