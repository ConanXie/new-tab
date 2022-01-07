import React, { useState, useEffect } from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import { Theme } from "@mui/material/styles"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Input from "@mui/material/Input"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"

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

  const handleChange = (name: keyof State) => (event: SelectChangeEvent<any>) => {
    setValues({ ...values, [name]: Number(event.target.value) })
  }

  useEffect(() => {
    if (open) {
      setValues({ ...values, columns, rows })
    }
  }, [open]) // eslint-disable-line

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
