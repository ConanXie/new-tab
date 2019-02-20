/** Send message */
export function sendMessage(name: string, message: any, callback?: (response: any) => any) {
  chrome.runtime.sendMessage({
    name,
    message
  }, response => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message)
    }
    if (typeof callback === "function") {
      callback(response)
    }
  })
}

/** Add message listender */
export function onMessage(name: string, callback?: (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => any) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { name: messageName, message: messageContent } = message
    if (messageName === name) {
      if (callback) {
        callback(messageContent, sender, sendResponse)
        return true
      }
    }
    return
  })
}
