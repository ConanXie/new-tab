import { SAVE_SETTINGS } from '../actions/settings'

/**
 * Get data from localStorage to create initialState,
 * because the Toggle component of material-ui can't be setting different defaultToggled value twice
 */
const getSettings = () => {
  /*chrome.storage.sync.get('settings', (obj) => {
    console.log(obj)
  })*/
  let settings
  // console.log({} instanceof Object && !({} instanceof Array))
  try {
    settings = JSON.parse(window.localStorage.getItem('settings'))
    return settings ? settings : {}
  } catch (error) {
    
  }
}

const initialState = getSettings()

export default function (state = initialState, action) {
  const { type, settings } = action
  
  switch (type) {
    case SAVE_SETTINGS:
      return {
        ...state,
        ...settings
      }
    default:
      return state
  }
}
