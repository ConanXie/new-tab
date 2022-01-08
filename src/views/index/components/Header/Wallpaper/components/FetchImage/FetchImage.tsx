import React, { FC, useMemo, useState } from "react"

import FetchProgress from "./FetchProgress"

import Item, { ItemProps, ItemMethods } from "../Item"
import Box from "@mui/material/Box"

const max = 100
const diff = 100

const FetchImage: FC<ItemProps & ItemMethods> = (props) => {
  const url = useMemo(
    () => `https://tab.xiejie.app/api/wallpaper/${screen.width}x${screen.height}`,
    [],
  )

  const [fetching, setFetching] = useState(false)
  const [completed, setCompleted] = useState(0)

  const startFetch = () => {
    if (fetching) {
      props.onError(chrome.i18n.getMessage("desktop_msg_fetching"))
      return
    }
    setFetching(true)
    fetchImage()
  }

  const fetchImage = async () => {
    try {
      // Get real URI of the image
      const res = await fetch(url)
      const data = await res.json()
      setCompleted(3)
      // Get image file
      const imageBlob = await getImage(data.result[0].url)
      endFetch()
      // update wallpaper
      props.onChange(imageBlob)
    } catch (error) {
      // TODO: Send a log to server
      props.onError(chrome.i18n.getMessage("desktop_msg_fetch_failed"))
      // restore progress state
      endFetch()
    }
  }
  /**
   * Get image via XHR
   */
  const getImage = (url: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("GET", url, true)
      xhr.responseType = "blob"
      xhr.onload = (event) => {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject(event)
        }
      }
      xhr.onerror = (event) => reject(event)
      let completed = 0
      xhr.onprogress = ({ loaded, total }) => {
        const progress = Math.round((loaded / total) * max)
        if (progress - completed > diff) {
          completed = progress
          setCompleted(Math.min(completed, max))
        }
      }
      xhr.onerror = () => {
        reject()
      }
      xhr.send()
    })
  }

  const endFetch = () => {
    setFetching(false)
    setCompleted(0)
  }

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Item
        disabled={props.disabled}
        primary={chrome.i18n.getMessage("wallpaper_random")}
        secondary={chrome.i18n.getMessage("wallpaper_random_descr")}
        onClick={startFetch}
      />
      <FetchProgress fetching={fetching} progress={completed} />
    </Box>
  )
}

export default FetchImage
