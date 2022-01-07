import React, { FC } from "react"

import BrightnessHigh from "@mui/icons-material/BrightnessHighOutlined"
import BrightnessMedium from "@mui/icons-material/BrightnessMediumOutlined"
import BrightnessLow from "@mui/icons-material/BrightnessLowOutlined"

import SliderItem from "./SliderItem"
import { ItemProps } from "./Item"

enum BrightnessRange {
  Min = 10,
  Max = 100,
  High = 80,
  Low = 30,
}

interface Props extends ItemProps {
  value: number
  onChange: (radius: number | number[]) => void
}

const Brightness: FC<Props> = (props) => {
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
