import React, { FC, useState } from "react"

import ColorPicker from "components/ColorPicker"

import Item, { ItemProps } from "./Item"

interface Props extends ItemProps {
  color: string
  onChange(value: string): void
}

const SelectColor: FC<Props> = (props) => {
  const [open, setOpen] = useState(false)

  const openColorPicker = () => {
    setOpen(true)
  }
  const closeColorPicker = (color?: string) => {
    setOpen(false)

    if (color) {
      props.onChange(color)
    }
  }
  return (
    <>
      <Item
        disabled={props.disabled}
        primary={chrome.i18n.getMessage("wallpaper_color")}
        secondary={props.color}
        onClick={openColorPicker}
      />
      <ColorPicker color={props.color} open={open} onClose={closeColorPicker} />
    </>
  )
}

export default SelectColor
