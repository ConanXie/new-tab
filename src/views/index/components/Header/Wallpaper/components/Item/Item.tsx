import * as React from "react"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"

interface PropsType {
  disabled?: boolean
  primary: string
  secondary?: string
  children?: React.ReactNode
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
