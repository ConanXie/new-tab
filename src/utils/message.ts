/**
 * send message
 * @param name message name
 * @param message message content
 * @param callback
 */
export function sendMessage(name: string, message: any, callback?: (response?: any) => any) {
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

/**
 * Message listener
 * @param name
 * @param callback
 */
export function onMessage(name: string, callback?: (message?: any, sender?: any, sendResponse?: any) => any) {
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
