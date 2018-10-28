import * as React from "react"
import { inject, observer } from "mobx-react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import Paper from "@material-ui/core/Paper"
import MenuList from "@material-ui/core/MenuList"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/Divider"

import { MenuStore } from "stores/menu"
import makeDumbProps from "utils/makeDumbProps"

const styles = createStyles({
  root: {
    borderRadius: 10,
    overflow: "hidden",
    "& > ul": {
      padding: 0,
    },
  },
  menuItem: {
    paddingRight: 56,
  },
  text: {
    fontSize: "0.9rem",
  },
  divider: {
    marginLeft: 56,
  },
  icon: {
    marginRight: 0,
  },
})

interface PropsType extends WithStyles<typeof styles> {
  menuStore: MenuStore
}

interface PosStyleType {
  top?: number | string
  right?: number | string
  left?: number | string
  bottom?: number | string
  visibility?: string
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
    const style: PosStyleType = {
      visibility: "visible"
    }
    if (left + clientWidth > window.innerWidth) {
      style.right = 0
    } else {
      style.left = left + "px"
    }
    if (top + clientHeight > window.innerHeight) {
      style.bottom = window.innerHeight - top + "px"
    } else {
      style.top = top + "px"
    }
    wrap.removeAttribute("style")
    const properties = Object.keys(style)
    for (const i of properties) {
      wrap.style[i] = style[i]
    }
  }
  public componentDidUpdate() {
    if (this.props.menuStore.menus.length) {
      this.calcPosition()
    } else {
      this.contextmenuRef.current!.style.visibility = "hidden"
    }
  }
  public componentDidMount() {
    document.addEventListener("click", this.props.menuStore.clearMenus, false)
  }
  public render() {
    const { classes, menuStore } = this.props
    return (
      <div className="contextmenu" ref={this.contextmenuRef}>
        <Paper classes={{ root: classes.root }}>
          <MenuList>
            {menuStore.menus.map(({ icon, text, onClick }, index) => (
              <div key={text}>
                <MenuItem classes={{ root: classes.menuItem }} onClick={onClick}>
                  <ListItemIcon className={classes.icon}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} classes={{ primary: classes.text }} />
                </MenuItem>
                {index < menuStore.menus.length - 1 && (
                  <Divider inset className={classes.divider} component="li" />
                )}
              </div>
            ))}
          </MenuList>
        </Paper>
      </div>
    )
  }
}

export default makeDumbProps(withStyles(styles)(ContextMenu))
