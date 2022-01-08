import { Theme } from "@mui/material/styles"
import { SystemStyleObject } from "@mui/system/styleFunctionSx"
import Color from "color"

export const acrylicBg: (theme: Theme) => SystemStyleObject<Theme> = ({ palette }) => ({
  backgroundColor: `${Color(palette.background.paper)
    .alpha(palette.mode === "light" ? 0.68 : 0.7)
    .toString()} !important`,
  backdropFilter: `saturate(${palette.mode === "light" ? 150 : 260}%) blur(24px) !important`,
})
