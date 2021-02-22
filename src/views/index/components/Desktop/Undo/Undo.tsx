import React from "react"
import { observer } from "mobx-react-lite"

import Snackbar from "@material-ui/core/Snackbar"
import Button from "@material-ui/core/Button"
// import Button from "./Button"

import { desktopStore } from "../../../store"
import Typography from "@material-ui/core/Typography"

interface Props {
  open: boolean
  onClose(): void
}

const Undo = observer(({ open, onClose }: Props) => {

  function handleSnackbarClose() {
    onClose()
  }

  /**
   * undo removed
   * @param all whether undo all of removed
   */
  const undo = (all?: boolean) => () => {
    desktopStore.undo(all)
    handleSnackbarClose()
  }

  console.log(desktopStore.undoMessage)

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      message={desktopStore.undoMessage}
      onClose={handleSnackbarClose}
      action={
        // <Button>武汉</Button>
        <>
          <Button key="undo" color="secondary" size="small" onClick={undo()}>
            {chrome.i18n.getMessage("removed_undo")}
          </Button>
          {desktopStore.removed.length > 1 && (
            <Button key="undoAll" color="secondary" size="small" onClick={undo(true)}>
              {chrome.i18n.getMessage("removed_undo_all")}
            </Button>
          )}
        </>
      }
    />
  )
})

export default Undo
