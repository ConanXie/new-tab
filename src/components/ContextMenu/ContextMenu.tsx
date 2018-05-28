import * as React from "react"

import withStyles, { WithStyles, StyleRules } from "@material-ui/core/styles/withStyles"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/Divider"
import EditIcon from "@material-ui/icons/Edit"
import InfoIcon from "@material-ui/icons/InfoOutline"
import ClearIcon from "@material-ui/icons/Clear"

type StylesType = "paper"
  | "menuItem"
  | "icon"
  | "text"
  | "divider"

const styles: StyleRules = {
  paper: {
    "borderRadius": 10,
    "& > ul": {
      padding: 0
    }
  },
  menuItem: {
    paddingRight: 56
  },
  text: {
    font: "0.9rem Roboto, 'Microsoft Yahei'"
  },
  divider: {
    marginLeft: 56
  },
  icon: {
    marginRight: 0
  }
}

interface PropsType {
  id: string
  open: boolean
  top: number
  left: number
  handleClose(): void
}

interface PosStyleType {
  top?: number,
  right?: number,
  left?: number,
  bottom?: number
}

class ContextMenu extends React.Component<WithStyles<StylesType> & PropsType, { style: PosStyleType }> {
  public state = {
    style: {}
  }
  public calcPosition = () => {
    const ulElement = document.querySelector(`#${this.props.id} ul`)
    const { clientWidth, clientHeight } = ulElement!
    const { top, left } = this.props
    const style: PosStyleType = {}
    if (left + clientWidth > window.innerWidth) {
      style.right = 0
    } else {
      style.left = left
    }
    if (top + clientHeight > window.innerHeight) {
      style.bottom = window.innerHeight - top
    } else {
      style.top = top
    }
    this.setState({ style })
  }
  public render() {
    const {
      id,
      open,
      classes
    } = this.props
    const { style } = this.state
    return (
      <Menu
        classes={{ paper: classes.paper }}
        id={id}
        open={open}
        anchorReference="none"
        PaperProps={{ style }}
        onEnter={this.calcPosition}
        onClose={this.props.handleClose}
      >
        <MenuItem classes={{ root: classes.menuItem }}>
          <ListItemIcon className={classes.icon}>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Edit" classes={{ primary: classes.text }} />
        </MenuItem>
        <Divider inset className={classes.divider} component="li" />
        <MenuItem classes={{ root: classes.menuItem }}>
          <ListItemIcon className={classes.icon}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="Website info" classes={{ primary: classes.text }} />
        </MenuItem>
        <Divider inset className={classes.divider} component="li" />
        <MenuItem classes={{ root: classes.menuItem }}>
          <ListItemIcon className={classes.icon}>
            <ClearIcon />
          </ListItemIcon>
          <ListItemText primary="Remove" classes={{ primary: classes.text }} />
        </MenuItem>
      </Menu>
    )
  }
}

export default withStyles(styles)<PropsType>(ContextMenu)
