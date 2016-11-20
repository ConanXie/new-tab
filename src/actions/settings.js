const ls = window.localStorage
const settings = ls.getItem('settings')

export function saveSettings(key, value) {
  return (dispatch, getState) => {
    const data = getState().settings.data
    data[key] = value
    ls.setItem('settings', JSON.stringify(data))
    // console.log(chrome.storage.sync.set({ settings: data }))
  }
}

export function saveTheme(index) {
  return (dispatch, getState) => {
    const data = getState().settings.data
    data.currentTheme = index
    ls.setItem('settings', JSON.stringify(data))
  }
}

/**
 * If autoSaveEngine Toggle is true,
 * save the current engine
 */
export function saveCurrentEngine() {
  return (dispatch, getState) => {
    const { currentEngine } = getState().searchEngine
    ls.setItem('currentEngine', JSON.stringify(currentEngine))
  }
}