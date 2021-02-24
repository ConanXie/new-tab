import React, { FC } from "react"

import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Slider from "@material-ui/core/Slider"

import { ItemProps } from "../Item"

const useStyles = makeStyles(() =>
  createStyles({
    listText: {
      paddingRight: 0,
    },
    listSecondary: {
      display: "flex",
    },
  }),
)

export interface Props extends ItemProps {
  value: number
  icon: React.ReactElement<any>
  min?: number
  max?: number
  step?: number
  children?: React.ReactNode
  onChange: (value: number | number[]) => void
}

const SliderItem: FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { disabled, value, icon, ...range } = props

  const handleChange = (event: React.ChangeEvent<any>, value: number | number[]) =>
    props.onChange(value)

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
}

export default SliderItem
