import React, { FC } from "react"

import { Theme } from "@mui/material/styles"
import makeStyles from "@mui/styles/makeStyles"
import createStyles from "@mui/styles/createStyles"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import ShareIcon from "@mui/icons-material/Share"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import { useSnackbar } from "notistack"

import Wrapper from "../../Layout/SettingsWrapper"
import GitHubIcon from "./Icons/GitHub"
import LogoIcon from "./Icons/Logo"

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
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
      color: palette.primary.main,
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

const About: FC = () => {
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
      <Wrapper>
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
              <IconButton onClick={copyToClipboard} size="large">
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={chrome.i18n.getMessage("settings_about_source_code")}>
              <IconButton href="https://github.com/ConanXie/new-tab/" size="large">
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Wrapper>
      <Wrapper>
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
      </Wrapper>
    </>
  )
}

export default About
