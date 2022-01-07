import React, { FC, useState } from "react"

import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ImageIcon from "@mui/icons-material/ImageOutlined"
import ColorIcon from "@mui/icons-material/ColorLensOutlined"

import Item, { ItemProps } from "./Item"
import { WallpaperType } from "../../../../store/wallpaper"

const source = [
  {
    type: WallpaperType.Image,
    text: chrome.i18n.getMessage("wallpaper_type_image"),
  },
  {
    type: WallpaperType.Color,
    text: chrome.i18n.getMessage("wallpaper_type_color"),
  },
]

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      width: 200,
    },
  }),
)

interface TypeMenuItemProps {
  selected: boolean
  value: number
  label: string
  onChange(v: number): void
}

export const TypeMenuItem: FC<TypeMenuItemProps> = ({ selected, label, value, onChange }) => {
  const handleClick = () => {
    onChange(value)
  }

  return (
    <MenuItem selected={selected} onClick={handleClick}>
      {label}
    </MenuItem>
  )
}

interface TypeMenuProps extends ItemProps {
  type: number
  onChange(value: number): void
}

const TypeMenu: FC<TypeMenuProps> = (props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>()

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(undefined)
  }

  const handleMenuClick = (value: number) => {
    setAnchorEl(undefined)
    props.onChange(value)
  }

  const { type } = props
  const classes = useStyles()
  const currentType = source.find((item) => item.type === type)!.text
  const icon = type === WallpaperType.Image ? <ImageIcon /> : <ColorIcon />

  return (
    <>
      <Item
        disabled={props.disabled}
        icon={icon}
        primary={chrome.i18n.getMessage("wallpaper_type")}
        secondary={currentType}
        onClick={handleClickListItem}
      />
      <Menu
        id="source-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        classes={{ paper: classes.paper }}
      >
        {source.map((item) => (
          <TypeMenuItem
            key={item.text}
            selected={item.type === type}
            value={item.type}
            label={item.text}
            onChange={handleMenuClick}
          >
            {item}
          </TypeMenuItem>
        ))}
      </Menu>
    </>
  )
}

export default TypeMenu
