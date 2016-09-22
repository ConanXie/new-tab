const ls = window.localStorage
const settings = ls.getItem('settings')

export const GET_SETTINGS = 'GET_SETTINGS'

export function getSettings() {
  let data
  try {
    data = JSON.parse(settings)
    if (!data) {
      data = {}
    }
  } catch (error) {
    console.log(error)
  }
  console.log(data)
  return {
    type: GET_SETTINGS,
    settings: data
  }
}

export function saveSettings(key, value) {
  return (dispatch, getState) => {
    const data = getState().settings.data
    data[key] = value
    ls.setItem('settings', JSON.stringify(data))
  }
}