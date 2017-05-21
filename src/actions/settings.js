const ls = window.localStorage

export const SAVE_SETTINGS = 'SAVE_SETTINGS'

export function saveSettings(key, value) {
  return (dispatch, getState) => {
    const { data } = getState().settings
    data[key] = value
    
    const save = JSON.stringify(data)
    ls.setItem('settings', save)
    
    dispatch({
      type: SAVE_SETTINGS,
      data: JSON.parse(save)
    })
  }
}

export function saveTheme(index) {
  return (dispatch, getState) => {
    const data = getState().settings.data
    data.currentTheme = index
    ls.setItem('settings', JSON.stringify(data))
  }
}
