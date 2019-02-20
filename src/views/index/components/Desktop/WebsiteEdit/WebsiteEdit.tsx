import * as React from "react"
import { inject, observer } from "mobx-react"

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
}

interface StateType {
  synced: boolean
  name: string
  url: string
  iconEditorOpen: boolean
}

@inject("websiteEditStore")
@observer
class WebsiteEdit extends React.Component<PropsType, StateType> {

  public state: StateType = {
    synced: false,
    name: "",
    url: "https://",
    iconEditorOpen: false,
  }
  /**
   * sync website info from props for edit
   * @param nextProps
   * @param prevState
   */
  public static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const { name, url } = nextProps.websiteEditStore.info
    if (name && nextProps.websiteEditStore.open && !prevState.synced) {
      return {
        synced: true,
        name,
        url,
      }
    }
    return null
  }

  /** record input value */
  public handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [name as "name"]: event.target.value,
    })
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
    this.props.websiteEditStore.saveInfo(this.state.name, this.state.url)
  }

  public openIconEditor = (event: React.SyntheticEvent<{}>) => {
    this.setState({
      iconEditorOpen: true,
    })
  }

  public handleIconEditorClose = (event: React.SyntheticEvent<{}>) => {
    this.setState({
      iconEditorOpen: false,
    })
  }

  public render() {
    const { name, url, iconEditorOpen } = this.state
    const { open, id, info } = this.props.websiteEditStore
    const { dialog, avatar, iconLabelWrap } = this.props.classes

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
              {chrome.i18n.getMessage(id ? "website_edit_title" : "website_add_title")}
            </DialogTitle>
            <DialogContent>
              <div className={iconLabelWrap}>
                <Avatar
                  className={avatar}
                  src={chrome.runtime.getURL(`icons/${info.icon}.png`)}
                  onClick={this.openIconEditor}
                />
                <TextField
                  autoFocus
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  defaultValue={info.name}
                  label={chrome.i18n.getMessage("website_edit_name")}
                  onChange={this.handleChange("name")}
                />
              </div>
              <br />
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                defaultValue={info.url || url}
                label={chrome.i18n.getMessage("website_edit_url")}
                onChange={this.handleChange("url")}
              />
            </DialogContent>
            <DialogActions>
              <Button type="submit" disabled={!name || !url}>
                {chrome.i18n.getMessage("button_done")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <IconEditor
          open={iconEditorOpen}
          url={info.url}
          icon={info.icon}
          onClose={this.handleIconEditorClose}
        />
      </>
    )
  }
}

export default withStyles(styles)(WebsiteEdit)
