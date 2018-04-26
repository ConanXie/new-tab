import * as React from "react"

import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import Switch from "material-ui/Switch"
import Divider from "material-ui/Divider"
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List"
import Menu, { MenuItem } from "material-ui/Menu"

const source = [
  chrome.i18n.getMessage("wallpaper_source_internet"),
  chrome.i18n.getMessage("wallpaper_source_local"),
  chrome.i18n.getMessage("wallpaper_source_solid")
]

const styles = {
  paper: {
    width: 200
  }
}

class Wallpaper extends React.Component<WithStyles<"paper">> {
  public state = {
    useWallpaper: false,
    sourceIndex: 0,
    anchorEl: undefined
  }
  private handleToggle = () => {
    this.setState({
      useWallpaper: !this.state.useWallpaper
    })
  }
  private handleClickSourceListItem = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget })
  }
  private handleSourceMenuClose = () => {
    this.setState({ anchorEl: undefined })
  }
  private handleSourceMenuClick(index: number) {
    this.setState({ sourceIndex: index, anchorEl: undefined })
  }
  public render() {
    const {
      sourceIndex,
      anchorEl
    } = this.state

    return (
      <div>
        <List>
          <ListItem button onClick={this.handleToggle}>
            <ListItemText primary={chrome.i18n.getMessage("desktop_wallpaper_label")} />
            <ListItemSecondaryAction>
              <Switch checked={this.state.useWallpaper} onChange={this.handleToggle} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="source-menu"
            aria-label={chrome.i18n.getMessage("wallpaper_source_title")}
            onClick={this.handleClickSourceListItem}
          >
            <ListItemText
              primary={chrome.i18n.getMessage("wallpaper_source_title")}
              secondary={source[sourceIndex]}
            />
          </ListItem>
        </List>
        <Menu
          id="source-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleSourceMenuClose}
          classes={{ paper: this.props.classes.paper }}
        >
          {source.map((item, index) => (
            <MenuItem
              key={item}
              selected={index === sourceIndex}
              onClick={event => this.handleSourceMenuClick(index)}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default withStyles(styles)<{}>(Wallpaper)
