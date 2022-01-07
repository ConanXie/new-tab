import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"

import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import { Theme } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import Avatar from "@mui/material/Avatar"

import IconEditor from "../IconEditor"
import { websiteEditStore, shortcutIconsStore } from "../../../store"
import { isBase64 } from "utils/validate"

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    dialog: {
      width: "30vw",
      minWidth: 300,
      maxWidth: 320,
    },
    iconLabelWrap: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      display: "inline-block",
      marginRight: spacing(2),
      marginLeft: spacing(-0.5),
      background: "none",
      width: spacing(6),
      height: spacing(6),
      cursor: "pointer",
    },
    urlInput: {
      marginLeft: spacing(8),
    },
  }),
)

const WebsiteEdit: FC = () => {
  const [synced, setSynced] = useState(false)
  const [label, setLabel] = useState("")
  const [url, setUrl] = useState("")
  const [newIcon, setNewIcon] = useState("")
  const [iconEditorOpen, setIconEditorOpen] = useState(false)

  const classes = useStyles()

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value)
  }

  const handleURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setUrl(url)
    updateIcon(url)
  }

  const timerRef = useRef<NodeJS.Timeout>()
  /**
   * Retrieve icon from built-in icons while typing url
   * only when adding and newIcon is't a custom icon
   */
  const updateIcon = (url: string) => {
    if (!websiteEditStore.info.id && !isBase64(newIcon)) {
      clearTimeout(timerRef.current!)
      timerRef.current = setTimeout(() => {
        shortcutIconsStore.retrieveIcon(url, (icon) => {
          setNewIcon(icon)
        })
      }, 300)
    }
  }

  /** close dialog */
  const handleClose = () => {
    setSynced(false)
    websiteEditStore.closeDialog()
  }

  /** save shortcut */
  const handleDone = (event: React.FormEvent) => {
    event.preventDefault()
    handleClose()
    websiteEditStore.saveInfo(label, url, newIcon)
  }

  const openIconEditor = () => {
    setIconEditorOpen(true)
  }

  const handleIconEditorClose = (icon?: string) => {
    setIconEditorOpen(false)
    if (icon) {
      setNewIcon(icon)
    }
  }

  useEffect(() => {
    const { open, info } = websiteEditStore
    const { id, label, url } = info

    if (open && !synced) {
      setSynced(true)
      setLabel(label)
      setUrl(url)
      setNewIcon(!id ? "default" : "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteEditStore.open, synced])

  const { open, info } = websiteEditStore
  const { id } = info
  const { dialog, avatar, iconLabelWrap } = classes
  const { shortcutIcon, getURL } = shortcutIconsStore
  const icon = newIcon || shortcutIcon(id, url)
  const iconURL = newIcon
    ? isBase64(newIcon)
      ? newIcon
      : chrome.runtime.getURL(`icons/${newIcon}.png`)
    : getURL(icon)

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{
          paper: dialog,
        }}
      >
        <form onSubmit={handleDone}>
          <DialogTitle>
            {chrome.i18n.getMessage(id ? "website_update_title" : "website_new_title")}
          </DialogTitle>
          <DialogContent>
            <div className={iconLabelWrap}>
              <Avatar className={avatar} src={iconURL} onClick={openIconEditor} />
              <TextField
                autoFocus
                fullWidth
                margin="dense"
                variant="outlined"
                defaultValue={info.label}
                label={chrome.i18n.getMessage("edit_label")}
                onChange={handleLabelChange}
              />
            </div>
            <br />
            <TextField
              fullWidth
              margin="dense"
              variant="outlined"
              defaultValue={url}
              label={chrome.i18n.getMessage("edit_url")}
              onChange={handleURLChange}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClose}>
              {chrome.i18n.getMessage("button_cancel")}
            </Button>
            <Button color="primary" type="submit" disabled={!url}>
              {chrome.i18n.getMessage("button_done")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <IconEditor open={iconEditorOpen} url={url} icon={icon} onClose={handleIconEditorClose} />
    </>
  )
}

export default observer(WebsiteEdit)
