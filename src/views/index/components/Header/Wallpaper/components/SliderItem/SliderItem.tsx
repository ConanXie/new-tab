import React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
// import Typography from "@material-ui/core/Typography"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Slider from "@material-ui/lab/Slider"

import { ItemPropsType } from "../Item"

const styles = (theme: Theme) => createStyles({
  listText: {
    paddingRight: 0,
  },
  listSecondary: {
    paddingTop: 10,
    paddingBottom: 11,
  },
})

export interface PropsType extends ItemPropsType, WithStyles<typeof styles> {
  value: number
  icon: React.ReactElement<any>
  min?: number
  max?: number
  step?: number
  children?: React.ReactNode
  onChange: (radius: number) => void
}

export default withStyles(styles)((props: PropsType) => {
  const { disabled, value, icon, classes, ...range } = props

  // tslint:disable-next-line:no-shadowed-variable
  const handleChange = (event: React.ChangeEvent<{}>, value: number) => props.onChange(value)

  return (
    <ListItem button disabled={disabled}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        className={classes.listText}
        classes={{ secondary: classes.listSecondary }}
        primary={props.children}
        secondaryTypographyProps={{ component: "div" }}
        secondary={
          <Slider
            disabled={disabled}
            value={value}
            min={range.min}
            max={range.max}
            step={range.step}
            onChange={handleChange}
          />
        }
      />
    </ListItem>
  )
})
