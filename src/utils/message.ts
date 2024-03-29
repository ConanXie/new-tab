/** Send message */
export function sendMessage(
  name: string,
  message: string,
  callback?: (response: any) => any,
): void {
  chrome.runtime.sendMessage(
    {
      name,
      message,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message, name, message)
      }
      if (typeof callback === "function") {
        callback(response)
      }
    },
  )
}

/** Add message listender */
export function onMessage(
  name: string,
  callback?: (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) => any,
): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { name: messageName, message: messageContent } = message
    if (messageName === name) {
      if (callback) {
        callback(messageContent, sender, sendResponse)
        // Returns true to keep the message channel open to the other end until sendResponse is called,
        // so should call sendResponse in callback if there is a callback
        // otherwise browser will defines chrome.runtime.lastError
        return true
      }
    }
    return
  })
}

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(window as any).sendMessage = sendMessage
