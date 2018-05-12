import { settingsStorage } from "utils/storage"
import { onMessage, sendMessage } from "utils/message"
import { base64toBlobURL } from "utils/fileConversions"

const wallpaper = "wallpaper"

onMessage("saveWallpaper", data => {
  chrome.storage.local.set({
    [wallpaper]: data
  })
})

// Initialize wallpaper
// Get base64 image data from storage and convert to blob url
chrome.storage.local.get([wallpaper], result => {
  const base64Data: string = result[wallpaper]
  if (base64Data) {
    const type = base64Data.match(/:([\w\/]+);/)![1]
    const sign = ";base64,"
    const code = base64Data.substr(base64Data.indexOf(sign) + sign.length)
    const url = base64toBlobURL(code, type)
    // Update wallpaper data in localStorage
    settingsStorage.transact("wallpaper", data => {
      if (!data || typeof data !== "object") {
        data = {}
      }
      URL.revokeObjectURL(data.wallpaper)
      data.wallpaper = url
      return data
    })
    sendMessage("updateWallpaper", url)
  }
})
