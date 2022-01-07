import { Theme } from "@mui/material/styles"
import makeStyles from "@mui/styles/makeStyles"
import Color from "color"

export const useAcrylic = makeStyles(({ palette }: Theme) => ({
  root: {
    // background: "none",
    // "&::before": {
    //   content: "''",
    //   position: "absolute",
    //   top: 0,
    //   left: 0,
    //   right: 0,
    //   bottom: 0,
    //   backgroundColor: Color(theme.palette.background.paper).alpha(0.75).toString(),
    //   backdropFilter: "saturate(180%) blur(20px)",
    // },
    backgroundColor: `${Color(palette.background.paper)
      .alpha(palette.mode === "light" ? 0.68 : 0.7)
      .toString()} !important`,
    backdropFilter: `saturate(${palette.mode === "light" ? 150 : 260}%) blur(24px) !important`,
  },
}))
