import React from "react"
import { inject, observer } from "mobx-react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import Paper from "@material-ui/core/Paper"
import MenuList from "@material-ui/core/MenuList"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/Divider"

import { MenuStore } from "store/menu"

const styles = createStyles({
  root: {
    borderRadius: 10,
    overflow: "hidden",
    "& > ul": {
      padding: 0,
    },
    "& li": {
      outline: "none",
    },
  },
  menuItem: {
    paddingRight: 72,
  },
  text: {
    fontSize: "0.9rem",
  },
  divider: {
    marginLeft: 56,
  },
  icon: {
    marginRight: 0,
    minWidth: 40,
  },
})

interface PropsType extends WithStyles<typeof styles> {
  menuStore?: MenuStore
}

@inject("menuStore")
@observer
class ContextMenu extends React.Component<PropsType> {
  private contextmenuRef: React.RefObject<HTMLDivElement> = React.createRef()
  /**
   * The position of contextmenu
   */
  public calcPosition = () => {
    const wrap = this.contextmenuRef.current!
    const { clientWidth, clientHeight } = wrap
    const { top, left } = this.props.menuStore!
    const style: React.CSSProperties = {
      visibility: "visible"
    }
    if (left + clientWidth > window.innerWidth) {
      style.right = 0
    } else {
      style.left = left + "px"
    }
    if (top + clientHeight > window.innerHeight) {
      style.bottom = window.innerHeight - top + 1 + "px"
    } else {
      style.top = top + "px"
    }
    wrap.removeAttribute("style")
    Object.keys(style).forEach(prop => (wrap.style as any)[prop] = (style as any)[prop])
  }
  public componentDidUpdate() {
    if (this.props.menuStore!.menus.length) {
      this.calcPosition()
    } else {
      this.contextmenuRef.current!.style.visibility = "hidden"
    }
  }
  public componentDidMount() {
    document.addEventListener("click", this.props.menuStore!.clearMenus)
    window.addEventListener("blur", this.props.menuStore!.clearMenus)
  }
  public componentWillUnmount() {
    document.removeEventListener("click", this.props.menuStore!.clearMenus)
    window.removeEventListener("blur", this.props.menuStore!.clearMenus)
  }
  public render() {
    const { classes, menuStore } = this.props
    return (
      <div className="contextmenu" ref={this.contextmenuRef}>
        <Paper classes={{ root: classes.root }}>
          <MenuList>
            {menuStore!.menus.map(({ disabled, icon, text, onClick }, index) => (
              <li key={index}>
                <MenuItem
                  classes={{ root: classes.menuItem }}
                  disabled={disabled}
                  component="div"
                  onClick={onClick}
                >
                  <ListItemIcon className={classes.icon}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} classes={{ primary: classes.text }} />
                </MenuItem>
                {index < menuStore!.menus.length - 1 && (
                  <Divider variant="inset" className={classes.divider} component="hr" />
                )}
              </li>
            ))}
          </MenuList>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(ContextMenu)
