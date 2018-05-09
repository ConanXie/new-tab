import * as React from "react"
import {
  ListItem,
  ListItemText
} from "material-ui/List"

interface PropsType {
  disabled?: boolean
  primary: string
  secondary?: string
  children?: any
  onClick(...args: any[]): any
}

export default (props: PropsType) => {
  const { disabled, primary, secondary } = props
  return (
    <ListItem button disabled={disabled} onClick={props.onClick}>
      <ListItemText
        primary={primary}
        secondary={secondary}
      />
      {props.children}
    </ListItem>
  )
}
