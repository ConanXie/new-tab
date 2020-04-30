import { makeStyles } from "@material-ui/core"
import Color from "color"

export const useAcrylic = makeStyles((theme) => ({
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
    backgroundColor: Color(theme.palette.background.paper).alpha(0.75).toString(),
    backdropFilter: "saturate(180%) blur(20px)",
  },
}))
