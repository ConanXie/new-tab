import * as React from "react"

import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import {
  ListItem,
  ListItemText
} from "material-ui/List"
import Menu, { MenuItem } from "material-ui/Menu"

const source: string[] = [
  chrome.i18n.getMessage("wallpaper_source_internet"),
  chrome.i18n.getMessage("wallpaper_source_local"),
  chrome.i18n.getMessage("wallpaper_source_solid")
]

const styles = {
  paper: {
    width: 200
  }
}

interface ItypeMenuItem {
  selected: boolean
  value: number,
  label: string,
  onChange(v: number): void
}

export class TypeMenuItem extends React.Component<ItypeMenuItem> {
  private handleClick = () => {
    this.props.onChange(this.props.value)
  }
  public render() {
    const { selected, label } = this.props
    return (
      <MenuItem
        selected={selected}
        onClick={this.handleClick}
      >
        {label}
      </MenuItem>
    )
  }
}

interface PropTypes {
  type: number
  onChange(value: number): void
}

class TypeMenu extends React.Component<WithStyles<"paper"> & PropTypes> {
  public state = {
    anchorEl: undefined
  }
  private handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget })
  }
  private handleMenuClose = () => {
    this.setState({ anchorEl: undefined })
  }
  private handleMenuClick = (value: number) => {
    this.setState({ anchorEl: undefined })
    this.props.onChange(value)
  }
  public render() {
    const { anchorEl } = this.state
    const { type, classes } = this.props

    return (
      <div>
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="source-menu"
          aria-label={chrome.i18n.getMessage("wallpaper_source_title")}
          onClick={this.handleClickListItem}
        >
          <ListItemText
            primary={chrome.i18n.getMessage("wallpaper_source_title")}
            secondary={source[type]}
          />
        </ListItem>
        <Menu
          id="source-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
          classes={{ paper: classes.paper }}
        >
          {source.map((item, index) => (
            <TypeMenuItem
              key={item}
              selected={index === type}
              value={index}
              label={item}
              onChange={this.handleMenuClick}
            >
              {item}
            </TypeMenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default withStyles(styles)<PropTypes>(TypeMenu)
