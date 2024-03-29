import React, { FC } from "react"

import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

interface Props {
  disabled?: boolean
  primary: string
  secondary?: string
  icon?: React.ReactElement<any>
  children?: React.ReactNode
  onClick: (...args: any[]) => any
}

const Item: FC<Props> = (props) => {
  const { disabled, primary, secondary, icon } = props
  return (
    <ListItem button disabled={disabled} onClick={props.onClick}>
      <ListItemIcon>{icon || <></>}</ListItemIcon>
      <ListItemText primary={primary} secondary={secondary} />
      {props.children}
    </ListItem>
  )
}

export default Item
