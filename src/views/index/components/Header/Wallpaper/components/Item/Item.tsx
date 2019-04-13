import React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

const styles = () => createStyles({
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
})

interface PropsType extends WithStyles<typeof styles> {
  disabled?: boolean
  primary: string
  secondary?: string
  icon?: React.ReactElement<any>
  children?: React.ReactNode
  onClick(...args: any[]): any
}

export default withStyles(styles)((props: PropsType) => {
  const { disabled, primary, secondary, icon, classes } = props
  return (
    <ListItem button disabled={disabled} onClick={props.onClick}>
      <ListItemIcon className={classes.icon}>
        {icon || <></>}
      </ListItemIcon>
      <ListItemText
        primary={primary}
        secondary={secondary}
      />
      {props.children}
    </ListItem>
  )
})
