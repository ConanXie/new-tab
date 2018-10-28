import * as React from "react"

// import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
// import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import TextField from "@material-ui/core/TextField"

import { WebsiteEditStore } from "../../../store/websiteEdit"
import { inject, observer } from "mobx-react"
import makeDumbProps from "utils/makeDumbProps"

interface PropsType {
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
   * @param nextProps PropsType
   * @param prevState StateType
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
      <Dialog open={open} onClose={this.handleClose}>
        <form onSubmit={this.handleDone}>
          <DialogTitle>
            {chrome.i18n.getMessage(id ? "website_edit_title" : "website_add_title")}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              defaultValue={info.name}
              label={chrome.i18n.getMessage("website_edit_name")}
              onChange={this.handleChange("name")}
            />
            <br />
            <TextField
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

export default makeDumbProps(WebsiteEdit)
