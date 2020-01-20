import React from "react"

import { Theme, makeStyles, createStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import ShareIcon from "@material-ui/icons/Share"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { useSnackbar } from "notistack"

import Wrap from "../../Layout/SettingsWrap"
import GitHubIcon from "./Icons/GitHub"
import LogoIcon from "./Icons/Logo"

const useStyles = makeStyles(({ spacing, overrides }: Theme) =>
  createStyles({
    sec: {
      padding: spacing(3),
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: spacing(1),
    },
    logo: {
      width: 40,
      height: 40,
      marginRight: spacing(1),
      marginLeft: spacing(-0.25),
      color: (overrides!.MuiButton!.textPrimary as React.CSSProperties)!.color,
    },
    "@keyframes rotate": {
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(360deg)",
      },
    },
    iconBtnWrap: {
      textAlign: "right",
      margin: spacing(-2),
    },
  }),
)

const share = "https://chrome.google.com/webstore/detail/kgfodmcknjlgkbgkkafogbdaibkfgdgo/"

function About() {
  const classes = useStyles()
  const { version_name: versionName, version } = chrome.runtime.getManifest()
  const { enqueueSnackbar } = useSnackbar()

  function copyToClipboard() {
    const input = document.createElement("input")
    input.value = share
    document.body.appendChild(input)
    input.focus()
    input.setSelectionRange(0, share.length)
    document.execCommand("copy")
    document.body.removeChild(input)

    enqueueSnackbar(chrome.i18n.getMessage("settings_about_clipboard"))
  }


  return (
    <>
      <Wrap>
        <div className={classes.sec}>
          <header className={classes.header}>
            <LogoIcon className={classes.logo} />
            <Typography variant="h6">Material Design New Tab</Typography>
          </header>
          <Typography gutterBottom>
            If you like Material Design, you may also like this extension.
          </Typography>
          <div className={classes.iconBtnWrap}>
            <Tooltip title={chrome.i18n.getMessage("settings_about_share")}>
              <IconButton onClick={copyToClipboard}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={chrome.i18n.getMessage("settings_about_source_code")}>
              <IconButton href="https://github.com/ConanXie/new-tab/">
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Wrap>
      <Wrap>
        <List>
          <ListItem
            component="a"
            button
            href={
              chrome.i18n.getUILanguage() === "zh-CN"
                ? "https://tab.xiejie.app/logs"
                : "https://github.com/ConanXie/new-tab/blob/master/CHANGELOG.md"
            }
          >
            <ListItemText
              primary={versionName || version}
              secondary="Click here to read the changelog"
            />
          </ListItem>
        </List>
      </Wrap>
    </>
  )
}

export default About
