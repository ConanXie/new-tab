import React from "react"

import BrightnessHigh from "@material-ui/icons/BrightnessHighOutlined"
import BrightnessMedium from "@material-ui/icons/BrightnessMediumOutlined"
import BrightnessLow from "@material-ui/icons/BrightnessLowOutlined"

import SliderItem from "./SliderItem"
import { ItemPropsType } from "./Item"

enum BrightnessRange {
  Min = 10,
  Max = 100,
  High = 80,
  Low = 30,
}

interface PropsType extends ItemPropsType {
  value: number
  onChange: (radius: number | number[]) => void
}

function Brightness(props: PropsType) {
  const { disabled, value, onChange } = props
  let icon = <BrightnessMedium />
  if (value > BrightnessRange.High) {
    icon = <BrightnessHigh />
  } else if (value < BrightnessRange.Low) {
    icon = <BrightnessLow />
  }
  return (
    <SliderItem
      disabled={disabled}
      icon={icon}
      value={value}
      min={BrightnessRange.Min}
      max={BrightnessRange.Max}
      onChange={onChange}
    >
      {chrome.i18n.getMessage("wallpaper_background_brightness")}
    </SliderItem>
  )
}

export default Brightness
