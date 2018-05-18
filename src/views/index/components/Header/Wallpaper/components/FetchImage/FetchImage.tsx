import * as React from "react"

import withStyles, { WithStyles, StyleRules } from "@material-ui/core/styles/withStyles"

import FetchProgress from "./FetchProgress"

import Item, { ItemPropsType, ItemMethods } from "../Item"

const styles: StyleRules = {
  wrap: {
    position: "relative"
  }
}

interface StateType {
  fetching: boolean,
  completed: number
}

class FetchImage extends React.Component<WithStyles<"wrap"> & ItemPropsType & ItemMethods, StateType> {
  private url = `https://tab.xiejie.co/api/wallpaper/${screen.width}x${screen.height}`
  public state = {
    fetching: false,
    completed: 0
  }
  private startFetch = () => {
    if (this.state.fetching) {
      this.props.onError(chrome.i18n.getMessage("desktop_msg_fetching"))
      return
    }
    this.setState({ fetching: true })
    this.fetchImage()
  }
  public async fetchImage() {
    try {
      // Get real URI of the image
      const res = await fetch(this.url)
      const data = await res.json()
      this.setState({ completed: 5 })
      // Get image file
      const imageBlob = await this.getImage(data.result[0].url)
      this.endFetch()
      // update wallpaper
      this.props.onChange(imageBlob)
    } catch (error) {
      // TODO: Send a log to server
      this.props.onError(chrome.i18n.getMessage("desktop_msg_fetch_failed"))
      // restore progress state
      this.endFetch()
    }
  }
  /**
   * Get image via XHR
   */
  public getImage(url: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("GET", url, true)
      xhr.responseType = "blob"
      xhr.onload = event => {
        if (xhr.status === 200) {
          // setTimeout(() => resolve(xhr.response), 400)
          resolve(xhr.response)
        } else {
          reject(event)
        }
      }
      xhr.onerror = event => reject(event)
      xhr.onprogress = event => {
        const completed = Math.round(event.loaded / event.total * 100) + 5
        this.setState({ completed: completed < 1 ? 1 : completed })
      }
      xhr.send()
    })
  }
  private endFetch = () => {
    this.setState({
      fetching: false,
      completed: 0
    })
  }
  public render() {
    const { classes } = this.props
    const { fetching, completed } = this.state
    return (
      <div className={classes.wrap}>
        <Item
          disabled={this.props.disabled}
          primary={chrome.i18n.getMessage("wallpaper_random")}
          secondary={chrome.i18n.getMessage("wallpaper_random_descr")}
          onClick={this.startFetch}
        />
        <FetchProgress fetching={fetching} progress={completed} />
      </div>
    )
  }
}

export default withStyles(styles)<ItemPropsType & ItemMethods>(FetchImage)
