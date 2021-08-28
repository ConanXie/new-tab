import storage from "store2"
import { settingsStorage } from "utils/storage"
import { onMessage, sendMessage } from "utils/message"
import { base64toBlobURL } from "utils/fileConversions"

const wallpaper = "wallpaper"

const updateWallpaper = (base64: string) => {
  const type = base64.match(/:([\w/]+);/)![1]
  const sign = ";base64,"
  const code = base64.substr(base64.indexOf(sign) + sign.length)
  const url = base64toBlobURL(code, type)
  // Save image type
  storage("image.type", type)
  // Update wallpaper data in localStorage
  settingsStorage.transact(wallpaper, (data) => {
    if (!data || typeof data !== "object") {
      data = {}
    }
    URL.revokeObjectURL(data.wallpaper)
    data.wallpaper = url
    return data
  })
  sendMessage("updateWallpaper", url)
}

onMessage("saveWallpaper", (base64: string, sender, sendResponse) => {
  sendResponse()
  chrome.storage.local.set({
    [wallpaper]: base64,
  })
  updateWallpaper(base64)
})

// Initialize wallpaper
// Get base64 image data from storage and convert to blob url
chrome.storage.local.get([wallpaper], (result) => {
  const base64: string = result[wallpaper]
  if (base64) {
    updateWallpaper(base64)
  }
})

onMessage("getIcons", (url: string, sender, sendResponse) => {
  let hostname = ""
  try {
    hostname = new URL(url).hostname
  } catch (error) {
    console.error(error)
  }

  import("./icons").then(({ default: icons }) => {
    let matched: string[] | undefined = (icons as any)[hostname]
    if (!matched) {
      const reg = /\./g
      let result
      // eslint-disable-next-line no-cond-assign
      while ((result = reg.exec(hostname))) {
        const mainHost = hostname.slice(result.index + 1)
        matched = (icons as any)[mainHost]
        if (matched) {
          break
        }
      }
      matched = matched || icons["*"]
    }
    sendResponse(matched)
  })
})
