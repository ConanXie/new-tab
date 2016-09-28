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
    if (settings) return settings
    else return {}
  } catch (error) {
    
  }
}

const initialState = {
  data: getSettings()
}

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}