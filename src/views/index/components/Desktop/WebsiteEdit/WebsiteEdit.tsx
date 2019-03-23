import React from "react"
import { inject, observer } from "mobx-react"
import makeDumbProps from "utils/makeDumbProps"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import TextField from "@material-ui/core/TextField"
import Avatar from "@material-ui/core/Avatar"

import IconEditor from "../IconEditor"
import { WebsiteEditStore } from "../../../store/websiteEdit"
import { ShortcutIconsStore } from "../../../store/shortcutIcons"
import { isBase64 } from "utils/validate"

const styles = ({ spacing }: Theme) => createStyles({
  dialog: {
    width: "30vw",
    minWidth: 300,
    maxWidth: 320,
  },
  iconLabelWrap: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    display: "inline-block",
    marginRight: spacing.unit * 2,
    marginLeft: -spacing.unit / 2,
    background: "none",
    width: spacing.unit * 6,
    height: spacing.unit * 6,
    cursor: "pointer",
  },
  urlInput: {
    marginLeft: spacing.unit * 8,
  },
})

interface PropsType extends WithStyles<typeof styles> {
  websiteEditStore: WebsiteEditStore
  shortcutIconsStore: ShortcutIconsStore
}

interface StateType {
  synced: boolean
  label: string
  url: string
  newIcon: string
  iconEditorOpen: boolean
}

@inject("websiteEditStore", "shortcutIconsStore")
@observer
class WebsiteEdit extends React.Component<PropsType, StateType> {

  public state: StateType = {
    synced: false,
    label: "",
    url: "",
    newIcon: "default",
    iconEditorOpen: false,
  }

  public handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      label: event.target.value,
    })
  }

  public handleURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    this.setState({ url })
    this.updateIcon(url)
  }

  public timer?: NodeJS.Timeout
  /**
   * Retrieve icon from built-in icons while typing url
   * only when adding and newIcon is't a custom icon
   */
  public updateIcon = (url: string) => {
    if (!this.props.websiteEditStore.info.id && !isBase64(this.state.newIcon)) {
      clearTimeout(this.timer!)
      this.timer = setTimeout(() => {
        this.props.shortcutIconsStore.retrieveIcon(url, icon => {
          this.setState({ newIcon: icon })
        })
      }, 300)
    }
  }

  /** close dialog */
  public handleClose = () => {
    this.setState({ synced: false })
    this.props.websiteEditStore.closeDialog()
  }

  /** save shortcut */
  public handleDone = (event: React.FormEvent) => {
    event.preventDefault()
    this.handleClose()
    const { label, url, newIcon } = this.state
    this.props.websiteEditStore.saveInfo(label, url, newIcon)
  }

  public openIconEditor = (event: React.SyntheticEvent<{}>) => {
    this.setState({
      iconEditorOpen: true,
    })
  }

  public handleIconEditorClose = (icon?: string) => {
    const state: any = {
      iconEditorOpen: false,
    }
    if (icon) {
      state.newIcon = icon
    }
    this.setState(state)
  }

  public componentDidUpdate() {
    const { open, info } = this.props.websiteEditStore
    const { id, label, url } = info

    if (open && !this.state.synced) {
      this.setState({
        synced: true,
        label,
        url,
        newIcon: !id ? "default" : "",
      })
    }
  }

  public render() {
    const { label, url, newIcon, iconEditorOpen } = this.state
    const { open, info } = this.props.websiteEditStore
    const { id } = info
    const { dialog, avatar, iconLabelWrap } = this.props.classes
    const { shortcutIcon, getURL } = this.props.shortcutIconsStore
    const icon = newIcon || shortcutIcon(id, url)
    const iconURL = newIcon
      ? isBase64(newIcon) ? newIcon : chrome.runtime.getURL(`icons/${newIcon}.png`)
      : getURL(icon)

    return (
      <>
        <Dialog
          open={open}
          onClose={this.handleClose}
          classes={{
            paper: dialog,
          }}
        >
          <form onSubmit={this.handleDone}>
            <DialogTitle>
              {chrome.i18n.getMessage(id ? "website_update_title" : "website_new_title")}
            </DialogTitle>
            <DialogContent>
              <div className={iconLabelWrap}>
                <Avatar
                  className={avatar}
                  src={iconURL}
                  onClick={this.openIconEditor}
                />
                <TextField
                  autoFocus
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  defaultValue={info.label}
                  label={chrome.i18n.getMessage("edit_label")}
                  onChange={this.handleLabelChange}
                />
              </div>
              <br />
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                defaultValue={url}
                label={chrome.i18n.getMessage("edit_url")}
                onChange={this.handleURLChange}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" type="submit" disabled={!label || !url}>
                {chrome.i18n.getMessage("button_done")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <IconEditor
          open={iconEditorOpen}
          url={url}
          icon={icon}
          onClose={this.handleIconEditorClose}
        />
      </>
    )
  }
}

export default makeDumbProps(withStyles(styles)(WebsiteEdit))
