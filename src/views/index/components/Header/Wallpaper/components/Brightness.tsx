import * as React from "react"

import BrightnessHighIcon from "@material-ui/icons/BrightnessMedium"

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
    icon={<BrightnessHighIcon />}
    value={props.value}
    onChange={props.onChange}
  />
)
