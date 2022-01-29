import React, { useState, useEffect } from "react"
import { observer, useLocalStore } from "mobx-react-lite"

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
import { SxProps, Theme } from "@mui/material/styles"

interface Props {
  open: boolean
  onClose(): void
}

interface State {
  columns: number
  rows: number
}

const generateNumberList = (max = 30) =>
  "a"
    .repeat(max)
    .split("")
    .map((_, index) => (
      <MenuItem value={index + 1} key={index}>
        {index + 1}
      </MenuItem>
    ))

const labelStyles: SxProps<Theme> = {
  transform: "translate(0, -9px) scale(0.75)",
}

const Grid = observer<Props>(({ open, onClose }) => {
  const { columns, rows, updateGrid } = useLocalStore(() => desktopSettings)
  const [values, setValues] = useState<State>({ columns, rows })

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
        <DialogContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            pt: "20px !important",
          }}
        >
          <FormControl
            sx={{
              minWidth: "120px",
              "&:first-of-type": {
                marginRight: 2,
              },
            }}
          >
            <InputLabel htmlFor="desktop-grid-columns" sx={labelStyles}>
              Columns
            </InputLabel>
            <Select
              value={values.columns}
              input={<Input id="desktop-grid-columns" />}
              onChange={handleChange("columns")}
            >
              {generateNumberList(30)}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              minWidth: "120px",
              "&:first-of-type": {
                marginRight: 2,
              },
            }}
          >
            <InputLabel htmlFor="desktop-grid-rows" sx={labelStyles}>
              Rows
            </InputLabel>
            <Select
              value={values.rows}
              input={<Input id="desktop-grid-rows" />}
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
