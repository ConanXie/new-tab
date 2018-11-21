import * as React from "react"

import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"

import FetchProgress from "./FetchProgress"

import Item, { ItemPropsType, ItemMethods } from "../Item"

const styles = createStyles({
  wrap: {
    position: "relative"
  }
})

interface StateType {
  fetching: boolean,
  completed: number
}

class FetchImage extends React.Component<WithStyles<typeof styles> & ItemPropsType & ItemMethods, StateType> {
  private url = `https://tab.xiejie.app/api/wallpaper/${screen.width}x${screen.height}`
  public readonly max = 100
  public readonly diff = 10
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
      this.setState({ completed: 3 })
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
          resolve(xhr.response)
        } else {
          reject(event)
        }
      }
      xhr.onerror = event => reject(event)
      let completed = 0
      xhr.onprogress = ({ loaded, total }) => {
        const progress = Math.round(loaded / total * this.max)
        if (progress - completed > this.diff) {
          completed = progress
          this.setState({ completed: Math.min(completed, this.max) })
        }
      }
      xhr.onerror = () => {
        reject()
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

export default withStyles(styles)(FetchImage)
