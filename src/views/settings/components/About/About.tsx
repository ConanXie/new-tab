import * as React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import ShareIcon from "@material-ui/icons/Share"
import Snackbar from "@material-ui/core/Snackbar"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"

import Wrap from "../../Layout/SettingsWrap"
import GitHubIcon from "./Icons/GitHub"
import LogoIcon from "./Icons/Logo"

const styles = ({ spacing, overrides }: Theme) => createStyles({
  sec: {
    padding: "24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: spacing.unit,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: spacing.unit,
    marginLeft: -spacing.unit / 4,
    color: overrides!.MuiButton!.textPrimary!.color,
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
    margin: -spacing.unit * 2,
  }
})

class About extends React.Component<WithStyles<typeof styles>> {

  public state = {
    snackbarOpen: false,
    message: "",
  }

  public readonly shared = "https://chrome.google.com/webstore/detail/kgfodmcknjlgkbgkkafogbdaibkfgdgo/"

  public copyToClipboard = () => {
    const input = document.createElement("input")
    input.value = this.shared
    document.body.appendChild(input)
    input.focus()
    input.setSelectionRange(0, this.shared.length)
    document.execCommand("copy")
    document.body.removeChild(input)

    this.setState({
      snackbarOpen: true,
      message: chrome.i18n.getMessage("settings_about_clipboard"),
    })
  }

  public handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false })
  }

  public render() {
    const { classes } = this.props
    const { snackbarOpen, message } = this.state
    const { version_name, version } = chrome.runtime.getManifest()
    return (
      <React.Fragment>
        <Wrap>
          <div className={classes.sec}>
            <header className={classes.header}>
              <LogoIcon className={classes.logo} />
              <Typography variant="h6">Material Design New Tab</Typography>
            </header>
            <Typography gutterBottom>If you like Material Design, you may also like this extension.</Typography>
            <div className={classes.iconBtnWrap}>
              <Tooltip title={chrome.i18n.getMessage("settings_about_share")}>
                <IconButton onClick={this.copyToClipboard}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={chrome.i18n.getMessage("settings_about_source_code")}>
                <IconButton
                  href="https://github.com/ConanXie/new-tab/"
                >
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
                primary={version_name || version}
                secondary="Click here to read the changelog"
              />
            </ListItem>
          </List>
        </Wrap>
        <Snackbar
          open={snackbarOpen}
          message={message}
          autoHideDuration={2000}
          onClose={this.handleSnackbarClose}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(About)
