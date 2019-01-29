import * as React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/lab/Slider"

import { ItemPropsType } from "../Item"

const styles = (theme: Theme) => createStyles({
  root: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: 49,
    overflow: "hidden",
  },
  sliderWrap: {
    flex: 1,
    marginLeft: theme.spacing.unit * 3,
  },
  label: {
    marginBottom: 12,
  },
})

export interface PropsType extends ItemPropsType, WithStyles<typeof styles> {
  value: number
  icon: React.ReactNode
  id?: string
  onChange: (radius: number) => void
}

export default withStyles(styles)((props: PropsType) => {
  const { disabled, value, icon, id, classes } = props

  // tslint:disable-next-line:no-shadowed-variable
  const handleChange = (event: React.ChangeEvent, value: number) => props.onChange(value)

  return (
    <div className={classes.root}>
      {icon}
      <div className={classes.sliderWrap}>
        <Typography id={id} className={classes.label}>{chrome.i18n.getMessage("wallpaper_blur")}</Typography>
        <Slider
          aria-labelledby={id}
          disabled={disabled}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  )
})
