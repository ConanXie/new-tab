import * as React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Item, { ItemPropsType } from "./Item"

const source = [{
  type: 1,
  text: chrome.i18n.getMessage("wallpaper_type_image")
}, {
  type: 2,
  text: chrome.i18n.getMessage("wallpaper_type_color")
}]

const styles = {
  paper: {
    width: 200
  }
}

interface ITypeMenuItem {
  selected: boolean
  value: number,
  label: string,
  onChange(v: number): void
}

export class TypeMenuItem extends React.Component<ITypeMenuItem> {
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

interface PropsType extends ItemPropsType {
  type: number
  onChange(value: number): void
}

class TypeMenu extends React.Component<WithStyles<"paper"> & PropsType> {
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
    const currentType = source.find(item => item.type === type)!.text

    return (
      <React.Fragment>
        <Item
          disabled={this.props.disabled}
          primary={chrome.i18n.getMessage("wallpaper_type")}
          secondary={currentType}
          onClick={this.handleClickListItem}
        />
        <Menu
          id="source-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
          classes={{ paper: classes.paper }}
        >
          {source.map((item, index) => (
            <TypeMenuItem
              key={item.text}
              selected={item.type === type}
              value={item.type}
              label={item.text}
              onChange={this.handleMenuClick}
            >
              {item}
            </TypeMenuItem>
          ))}
        </Menu>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)<PropsType>(TypeMenu)
