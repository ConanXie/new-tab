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
  const data: string = result[wallpaper]
  if (data) {
    const type = data.match(/:([\w\/]+);/)![1]
    const sign = ";base64,"
    const code = data.substr(data.indexOf(sign) + sign.length)
    const url = base64toBlobURL(code, type)
    localStorage.setItem(wallpaper, url)
    sendMessage("updateWallpaper", url)
  }
})
