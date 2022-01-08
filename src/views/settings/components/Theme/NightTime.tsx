import React, { useState, useEffect, FC, useMemo } from "react"

import { SxProps, Theme } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import Input from "@mui/material/Input"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

const defaultValue = "00"

enum TimePattern {
  Hour,
  Minute,
}

interface Props {
  times: string[]
  open: boolean
  onClose: (times?: string[]) => void
}

interface TimeState {
  error: boolean
  value: string
}

const NightTime: FC<Props> = (props) => {
  const { times, open, onClose } = props
  const [startHourState, setStartHourState] = useState<TimeState>({
    error: false,
    value: defaultValue,
  })
  const [startMinuteState, setStartMinuteState] = useState<TimeState>({
    error: false,
    value: defaultValue,
  })
  const [endHourState, setEndHourState] = useState<TimeState>({
    error: false,
    value: defaultValue,
  })
  const [endMinuteState, setEndMinuteState] = useState<TimeState>({
    error: false,
    value: defaultValue,
  })

  useEffect(() => {
    if (open) {
      const start = times[0].split(":")
      const end = times[1].split(":")
      setStartHourState({
        error: false,
        value: start[0] || defaultValue,
      })
      setStartMinuteState({
        error: false,
        value: start[1] || defaultValue,
      })
      setEndHourState({
        error: false,
        value: end[0] || defaultValue,
      })
      setEndMinuteState({
        error: false,
        value: end[1] || defaultValue,
      })
    }
  }, [open, times])

  const handleChange = (
    setState: (value: React.SetStateAction<TimeState>) => void,
    pattern: TimePattern,
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      const max = pattern === TimePattern.Hour ? 23 : 59
      const isNumber = /^[0-5]?[0-9]$/.test(value)
      const error = !isNumber || Number(value) > max
      setState({
        error,
        value,
      })
    }
  }

  function handleClose() {
    onClose()
  }

  function padLeftZero(value: number | string) {
    value = Number(value)
    return value < 10 ? `0${value}` : String(value)
  }

  function handleDone(event: React.FormEvent) {
    event.preventDefault()
    if (
      !startHourState.error &&
      !startMinuteState.error &&
      !endHourState.error &&
      !endMinuteState.error
    ) {
      onClose([
        `${padLeftZero(startHourState.value)}:${padLeftZero(startMinuteState.value)}`,
        `${padLeftZero(endHourState.value)}:${padLeftZero(endMinuteState.value)}`,
      ])
    }
  }

  const inputStyle: SxProps<Theme> = useMemo(
    () => ({
      width: "2em",
      "& .MuiInput-input": {
        textAlign: "center",
      },
    }),
    [],
  )

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{chrome.i18n.getMessage("settings_night_time")}</DialogTitle>
      <form onSubmit={handleDone}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              "& > div:last-child": {
                marginLeft: 6,
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: 2,
                }}
              >
                {chrome.i18n.getMessage("settings_night_time_start")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Input
                  autoFocus
                  error={startHourState.error}
                  defaultValue={startHourState.value}
                  onChange={handleChange(setStartHourState, TimePattern.Hour)}
                  margin="dense"
                  sx={inputStyle}
                />
                <Typography sx={{ mt: "-4px", mx: 1 }}>:</Typography>
                <Input
                  error={startMinuteState.error}
                  margin="dense"
                  defaultValue={startMinuteState.value}
                  onChange={handleChange(setStartMinuteState, TimePattern.Minute)}
                  sx={inputStyle}
                />
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: 2,
                }}
              >
                {chrome.i18n.getMessage("settings_night_time_end")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Input
                  error={endHourState.error}
                  defaultValue={endHourState.value}
                  onChange={handleChange(setEndHourState, TimePattern.Hour)}
                  margin="dense"
                  sx={inputStyle}
                />
                <Typography sx={{ mt: "-4px", mx: 1 }}>:</Typography>
                <Input
                  error={endMinuteState.error}
                  margin="dense"
                  defaultValue={endMinuteState.value}
                  onChange={handleChange(setEndMinuteState, TimePattern.Minute)}
                  sx={inputStyle}
                />
              </Box>
            </Box>
          </Box>
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

export default NightTime
