import React, { FC } from "react"

import BlurOnIcon from "@mui/icons-material/BlurOnOutlined"
import BlurOffIcon from "@mui/icons-material/BlurOffOutlined"

import SliderItem from "./SliderItem"
import { ItemProps } from "./Item"

interface Props extends ItemProps {
  value: number
  onChange: (radius: number | number[]) => void
}

const BlurImage: FC<Props> = (props) => (
  <SliderItem
    disabled={props.disabled}
    icon={props.value ? <BlurOnIcon /> : <BlurOffIcon />}
    value={props.value}
    onChange={props.onChange}
  >
    {chrome.i18n.getMessage("wallpaper_blur")}
  </SliderItem>
)

export default BlurImage
