import React, { useState, useEffect } from "react"

import { Theme, makeStyles, createStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import Input from "@material-ui/core/Input"
import Typography from "@material-ui/core/Typography"

const defaultValue = "00"

enum TimePattern {
  Hour,
  Minute,
}

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    wrap: {
      display: "flex",
      "& > div:last-child": {
        marginLeft: spacing(6),
      },
    },
    timeSec: {
      display: "flex",
      alignItems: "center",
    },
    timeTitle: {
      textAlign: "center",
      marginBottom: spacing(2),
    },
    inputRoot: {
      width: "2em",
    },
    input: {
      textAlign: "center",
    },
    symbol: {
      marginTop: -4,
      margin: spacing(0, 1),
    },
  }),
)

interface Props {
  times: string[]
  open: boolean
  onClose: (times?: string[]) => void
}

interface TimeState {
  error: boolean
  value: string
}

function NightTime(props: Props) {
  const { times, open, onClose } = props
  const classes = useStyles()
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
  ) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const max = pattern === TimePattern.Hour ? 23 : 59
    const isNumber = /^[0-5]?[0-9]$/.test(value)
    const error = !isNumber || Number(value) > max
    setState({
      error,
      value,
    })
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{chrome.i18n.getMessage("settings_night_time")}</DialogTitle>
      <form onSubmit={handleDone}>
        <DialogContent>
          <div className={classes.wrap}>
            <div>
              <Typography className={classes.timeTitle}>
                {chrome.i18n.getMessage("settings_night_time_start")}
              </Typography>
              <div className={classes.timeSec}>
                <Input
                  autoFocus
                  error={startHourState.error}
                  defaultValue={startHourState.value}
                  onChange={handleChange(setStartHourState, TimePattern.Hour)}
                  margin="dense"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.input,
                  }}
                />
                <Typography className={classes.symbol}>:</Typography>
                <Input
                  error={startMinuteState.error}
                  margin="dense"
                  defaultValue={startMinuteState.value}
                  onChange={handleChange(setStartMinuteState, TimePattern.Minute)}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.input,
                  }}
                />
              </div>
            </div>
            <div>
              <Typography className={classes.timeTitle}>
                {chrome.i18n.getMessage("settings_night_time_end")}
              </Typography>
              <div className={classes.timeSec}>
                <Input
                  error={endHourState.error}
                  defaultValue={endHourState.value}
                  onChange={handleChange(setEndHourState, TimePattern.Hour)}
                  margin="dense"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.input,
                  }}
                />
                <Typography className={classes.symbol}>:</Typography>
                <Input
                  error={endMinuteState.error}
                  margin="dense"
                  defaultValue={endMinuteState.value}
                  onChange={handleChange(setEndMinuteState, TimePattern.Minute)}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.input,
                  }}
                />
              </div>
            </div>
          </div>
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
