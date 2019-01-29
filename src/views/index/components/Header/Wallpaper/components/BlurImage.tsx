import * as React from "react"

import BlurOnIcon from "@material-ui/icons/BlurOn"
import BlurOffIcon from "@material-ui/icons/BlurOff"

import SliderItem from "./SliderItem"
import { ItemPropsType } from "./Item"

interface PropsType extends ItemPropsType {
  value: number
  onChange: (radius: number) => void
}

export default (props: PropsType) => (
  <SliderItem
    id="blur-slider"
    disabled={props.disabled}
    icon={props.value ? <BlurOnIcon /> : <BlurOffIcon />}
    value={props.value}
    onChange={props.onChange}
  />
)
