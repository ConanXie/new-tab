import React from "react"

import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

interface Props {
  disabled?: boolean
  primary: string
  secondary?: string
  icon?: React.ReactElement<any>
  children?: React.ReactNode
  onClick: (...args: any[]) => any
}

function Item(props: Props) {
  const { disabled, primary, secondary, icon } = props
  return (
    <ListItem button disabled={disabled} onClick={props.onClick}>
      <ListItemIcon>
        {icon || <></>}
      </ListItemIcon>
      <ListItemText
        primary={primary}
        secondary={secondary}
      />
      {props.children}
    </ListItem>
  )
}

export default Item
