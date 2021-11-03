import React, { useRef, useEffect } from "react"
import { observer } from "mobx-react-lite"
import classNames from "classnames"

import { makeStyles, createStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import MenuList from "@material-ui/core/MenuList"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

import menuStore from "store/menu"
import desktopSettings from "store/desktopSettings"
import { useAcrylic } from "../../styles/acrylic"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      overflow: "hidden",
      position: "fixed",
      visibility: "hidden",
      zIndex: 1500,
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
  }),
)

function ContextMenu() {
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const { menus, top, left, clearMenus } = menuStore

  const classes = useStyles()
  const acrylic = useAcrylic()

  /** calculate postion of context menu */
  function calcPosition() {
    const wrapper = contextMenuRef.current!
    const { clientWidth, clientHeight } = wrapper
    const style: React.CSSProperties = {
      visibility: "visible",
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
    wrapper.removeAttribute("style")
    Object.keys(style).forEach((prop) => ((wrapper.style as any)[prop] = (style as any)[prop]))
  }

  useEffect(() => {
    if (menus.length) {
      calcPosition()
    } else {
      contextMenuRef.current!.style.visibility = "hidden"
    }
  })

  useEffect(() => {
    document.addEventListener("click", clearMenus)
    window.addEventListener("blur", clearMenus)

    return () => {
      document.removeEventListener("click", clearMenus)
      window.removeEventListener("blur", clearMenus)
    }
  }, [clearMenus])

  return (
    <Paper
      classes={{
        root: classNames(desktopSettings.acrylicContextMenu ? acrylic.root : null, classes.root),
      }}
      ref={contextMenuRef}
    >
      <MenuList>
        {menus.map(({ disabled, icon, text, onClick }, index) => (
          <li key={index}>
            <MenuItem
              classes={{ root: classes.menuItem }}
              disabled={disabled}
              component="div"
              onClick={onClick}
            >
              <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
              <ListItemText primary={text} classes={{ primary: classes.text }} />
            </MenuItem>
          </li>
        ))}
      </MenuList>
    </Paper>
  )
}

export default observer(ContextMenu)
