import React, { FC } from "react"

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
import Box from "@mui/material/Box"

const share = "https://chrome.google.com/webstore/detail/kgfodmcknjlgkbgkkafogbdaibkfgdgo/"

const About: FC = () => {
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
        <Box sx={{ padding: 3 }}>
          <Box component="header" sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
            <LogoIcon
              sx={{
                width: 40,
                height: 40,
                marginRight: 1,
                marginLeft: -0.25,
                color: "primary.main",
              }}
            />
            <Typography variant="h6">Material Design New Tab</Typography>
          </Box>
          <Typography gutterBottom>
            If you like Material Design, you may also like this extension.
          </Typography>
          <Box
            sx={{
              textAlign: "right",
              margin: -2,
            }}
          >
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
          </Box>
        </Box>
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
