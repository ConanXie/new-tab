import React, { useState, useEffect, FC } from "react"

import { makeStyles, createStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import TextField from "@material-ui/core/TextField"
import { observer } from "mobx-react-lite"

const useStyles = makeStyles(() => createStyles({
  dialog: {
    width: "30vw",
    minWidth: 300,
    maxWidth: 320,
  },
}))

interface Props {
  open: boolean
  label: string
  onClose: (label?: string) => void
}

const FolderEditor: FC<Props> = (props) => {
  const { open, onClose } = props
  const [label, setLabel] = useState("")
  const classes = useStyles()

  useEffect(() => {
    if (open) {
      setLabel(props.label)
    }
  }, [props.label, open])

  function handleDone(event: React.FormEvent) {
    event.preventDefault()
    onClose(label)
  }

  function handleClose() {
    onClose()
  }

  function handleLabelChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLabel(event.target.value)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ paper: classes.dialog }}
    >
      <form onSubmit={handleDone}>
        <DialogTitle>
          {chrome.i18n.getMessage("folder_edit_title")}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            variant="outlined"
            defaultValue={label}
            label={chrome.i18n.getMessage("edit_label")}
            onChange={handleLabelChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            {chrome.i18n.getMessage("button_cancel")}
          </Button>
          <Button color="primary" type="submit">
            {chrome.i18n.getMessage("button_done")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default observer(FolderEditor)
