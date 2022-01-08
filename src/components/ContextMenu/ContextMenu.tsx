import React, { useRef, useEffect } from "react"
import { observer } from "mobx-react-lite"

import Paper from "@mui/material/Paper"
import MenuList from "@mui/material/MenuList"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

import menuStore from "store/menu"
import desktopSettings from "store/desktopSettings"
import { acrylicBg } from "../../styles/acrylic"

function ContextMenu() {
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const { menus, top, left, clearMenus } = menuStore

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
      ref={contextMenuRef}
      sx={{
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
        "&": desktopSettings.acrylicContextMenu ? acrylicBg : null,
      }}
    >
      <MenuList>
        {menus.map(({ disabled, icon, text, onClick }, index) => (
          <MenuItem
            disabled={disabled}
            onClick={onClick}
            key={index}
            sx={{
              paddingRight: 9,
              paddingTop: 1,
              paddingBottom: 1,
            }}
          >
            <ListItemIcon
              sx={{
                marginRight: 0,
                minWidth: 40,
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              sx={{
                "& > .MuiTypography-root": {
                  fontSize: "0.9rem",
                },
              }}
            />
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  )
}

export default observer(ContextMenu)
