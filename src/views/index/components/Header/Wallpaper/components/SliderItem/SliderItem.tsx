import React, { FC } from "react"

import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Slider from "@mui/material/Slider"

import { ItemProps } from "../Item"

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
  const { disabled, value, icon, ...range } = props

  const handleChange = (event: any, value: number | number[]) => props.onChange(value)

  return (
    <ListItem button disabled={disabled}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
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
        sx={{
          "& .MuiTypography-root": {
            width: "90%",
          },
        }}
      />
    </ListItem>
  )
}

export default SliderItem
