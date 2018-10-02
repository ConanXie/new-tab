import * as React from "react"

import { WithStyles, StyleRulesCallback, withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import Input from "@material-ui/core/Input"
import Typography from "@material-ui/core/Typography"

const defaultValue = "00"

const styles: StyleRulesCallback = theme => ({
  wrap: {
    display: "flex",
    "& > div:last-child": {
      marginLeft: theme.spacing.unit * 6,
    }
  },
  timeSec: {
    display: "flex",
    alignItems: "center",
  },
  timeTitle: {
    textAlign: "center",
    marginBottom: theme.spacing.unit * 2,
  },
  inputRoot: {
    width: "2em",
  },
  input: {
    textAlign: "center",
  },
  symbol: {
    marginTop: -4,
    margin: `0 ${theme.spacing.unit}px`,
  },
})

interface PropsType extends WithStyles<typeof styles> {
  times: string[]
  open: boolean
  onClose(times?: string[]): void
}

interface TimeType {
  error: boolean
  value: string
}

interface StateType {
  synced: boolean,
  startHours: TimeType,
  startMinutes: TimeType,
  endHours: TimeType,
  endMinutes: TimeType,
}

class NightTime extends React.Component<PropsType, StateType> {

  public state = {
    synced: false,
    startHours: {
      error: false,
      value: defaultValue,
    },
    startMinutes: {
      error: false,
      value: defaultValue,
    },
    endHours: {
      error: false,
      value: defaultValue,
    },
    endMinutes: {
      error: false,
      value: defaultValue,
    },
  }

  /**
   * sync time info from props for editing hours and minutes
   * @param nextProps PropsType
   * @param prevState StateType
   */
  public static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const { times } = nextProps
    if (!prevState.synced) {
      const start = times[0].split(":")
      const end = times[1].split(":")
      return {
        synced: true,
        startHours: {
          value: start[0] || defaultValue,
        },
        startMinutes: {
          value: start[1] || defaultValue,
        },
        endHours: {
          value: end[0] || defaultValue,
        },
        endMinutes: {
          value: end[1] || defaultValue,
        },
      }
    }
    return null
  }

  /**
   * close dialog
   */
  public handleClose = () => {
    this.props.onClose()
    this.setState({ synced: false })
  }

  public handleDone = (event: React.FormEvent) => {
    event.preventDefault()
    const {
      startHours,
      startMinutes,
      endHours,
      endMinutes,
    } = this.state
    if (!startHours.error
      && !startMinutes.error
      && !endHours.error
      && !endMinutes.error
    ) {
      this.props.onClose([
        `${this.padZero(startHours.value)}:${this.padZero(startMinutes.value)}`,
        `${this.padZero(endHours.value)}:${this.padZero(endMinutes.value)}`
      ])
    }
  }

  public padZero = (value: number | string) => {
    value = Number(value)
    return value < 10 ? `0${value}` : String(value)
  }

  /**
   * record input value
   */
  public handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const max = /hour/i.test(name) ? 23 : 59
    const isNumber = /^[0-5]?[0-9]$/.test(value)
    let error = false
    if (!isNumber || Number(value) > max) {
      error = true
    }
    this.setState({
      [name as "startHours"]: {
        value,
        error,
      }
    })
  }

  public render() {
    const {
      startHours,
      startMinutes,
      endHours,
      endMinutes,
    } = this.state

    const { open, classes } = this.props

    return (
      <Dialog open={open} onClose={this.handleClose}>
        <form onSubmit={this.handleDone}>
          <DialogContent>
            <div className={classes.wrap}>
              <div>
                <Typography className={classes.timeTitle}>
                  {chrome.i18n.getMessage("settings_night_time_start")}
                </Typography>
                <div className={classes.timeSec}>
                  <Input
                    autoFocus
                    error={startHours.error}
                    defaultValue={startHours.value}
                    onChange={this.handleChange("startHours")}
                    margin="dense"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.input,
                    }}
                  />
                  <Typography className={classes.symbol}>:</Typography>
                  <Input
                    error={startMinutes.error}
                    margin="dense"
                    defaultValue={startMinutes.value}
                    onChange={this.handleChange("startMinutes")}
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
                    error={endHours.error}
                    defaultValue={endHours.value}
                    onChange={this.handleChange("endHours")}
                    margin="dense"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.input,
                    }}
                  />
                  <Typography className={classes.symbol}>:</Typography>
                  <Input
                    error={endMinutes.error}
                    margin="dense"
                    defaultValue={endMinutes.value}
                    onChange={this.handleChange("endMinutes")}
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
            <Button onClick={this.handleClose}>
              {chrome.i18n.getMessage("button_cancel")}
            </Button>
            <Button type="submit">
              {chrome.i18n.getMessage("button_done")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default withStyles(styles)(NightTime)
