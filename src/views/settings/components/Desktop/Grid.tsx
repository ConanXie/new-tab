import React, { useState, useEffect } from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"

import { desktopSettings } from "../../store"

interface Props {
  open: boolean
  onClose(): void
}

interface State {
  columns: number
  rows: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      minWidth: 120,
      "&:first-child": {
        marginRight: theme.spacing(2),
      },
    },
  }),
)

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const generateNumberList = (max = 30) =>
  "a"
    .repeat(max)
    .split("")
    .map((value, index) => (
      <MenuItem value={index + 1} key={index}>
        {index + 1}
      </MenuItem>
    ))

const Grid = observer<Props>(({ open, onClose }) => {
  const { columns, rows, updateGrid } = useLocalStore(() => desktopSettings)
  const [values, setValues] = useState<State>({ columns, rows })
  const classes = useStyles()

  function handleDone(event: React.FormEvent) {
    event.preventDefault()
    updateGrid(values.columns, values.rows)
    onClose()
  }

  const handleChange = (name: keyof State) => (event: React.ChangeEvent<any>) => {
    setValues({ ...values, [name]: Number(event.target.value) })
  }

  useEffect(() => {
    if (open) {
      setValues({ ...values, columns, rows })
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleDone}>
        <DialogTitle>Desktop grid</DialogTitle>
        <DialogContent className={classes.container}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="desktop-grid-columns">Columns</InputLabel>
            <Select
              value={values.columns}
              input={<Input id="desktop-grid-columns" />}
              MenuProps={MenuProps}
              onChange={handleChange("columns")}
            >
              {generateNumberList(30)}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="desktop-grid-rows">Rows</InputLabel>
            <Select
              value={values.rows}
              input={<Input id="desktop-grid-rows" />}
              MenuProps={MenuProps}
              onChange={handleChange("rows")}
            >
              {generateNumberList(30)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            {chrome.i18n.getMessage("button_cancel")}
          </Button>
          <Button color="primary" type="submit">
            {chrome.i18n.getMessage("button_done")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})

export default Grid
