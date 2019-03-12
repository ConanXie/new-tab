import React from "react"

import BlurOnIcon from "@material-ui/icons/BlurOnOutlined"
import BlurOffIcon from "@material-ui/icons/BlurOffOutlined"

import SliderItem from "./SliderItem"
import { ItemPropsType } from "./Item"

interface PropsType extends ItemPropsType {
  value: number
  onChange: (radius: number) => void
}

export default (props: PropsType) => (
  <SliderItem
    disabled={props.disabled}
    icon={props.value ? <BlurOnIcon /> : <BlurOffIcon />}
    value={props.value}
    onChange={props.onChange}
  >
    {chrome.i18n.getMessage("wallpaper_blur")}
  </SliderItem>
)
