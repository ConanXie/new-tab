export const SAVE_SETTINGS = 'SAVE_SETTINGS'

export function saveSettings(data) {
  return (dispatch, getState) => {
    // const clone = JSON.parse(JSON.stringify(getState().settings))
    // clone[key] = value
    const clone = {
      ...getState().settings,
      ...data
    }

    window.localStorage.setItem('settings', JSON.stringify(clone))
    
    dispatch({
      type: SAVE_SETTINGS,
      settings: clone
    })
  }
}
