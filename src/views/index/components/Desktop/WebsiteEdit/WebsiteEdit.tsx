import * as React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import TextField from "@material-ui/core/TextField"

import { WebsiteEditStore } from "../../../store/websiteEdit"
import { inject, observer } from "mobx-react"

const styles = (theme: Theme) => createStyles({
  dialog: {
    width: "20vw",
    minWidth: 230,
    maxWidth: 320,
  },
})

interface PropsType extends WithStyles<typeof styles> {
  websiteEditStore: WebsiteEditStore
}

interface StateType {
  synced: boolean
  name: string
  url: string
}

@inject("websiteEditStore")
@observer
class WebsiteEdit extends React.Component<PropsType, StateType> {

  public state = {
    synced: false,
    name: "",
    url: "https://",
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

  /**
   * record input value
   */
  public handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [name as "name"]: event.target.value,
    })
  }
  /**
   * close dialog
   */
  public handleClose = () => {
    this.setState({ synced: false })
    this.props.websiteEditStore.closeDialog()
  }

  /**
   * save info
   */
  public handleDone = (event: React.FormEvent) => {
    event.preventDefault()
    this.handleClose()
    this.props.websiteEditStore.saveInfo(this.state.name, this.state.url)
  }

  public render() {
    const { name, url } = this.state
    const { open, id, info } = this.props.websiteEditStore
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        classes={{
          paper: this.props.classes.dialog,
        }}
      >
        <form onSubmit={this.handleDone}>
          <DialogTitle>
            {chrome.i18n.getMessage(id ? "website_edit_title" : "website_add_title")}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              defaultValue={info.name}
              label={chrome.i18n.getMessage("website_edit_name")}
              onChange={this.handleChange("name")}
            />
            <br />
            <TextField
              fullWidth
              margin="dense"
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
    )
  }
}

export default withStyles(styles)(WebsiteEdit)
