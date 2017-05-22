export const SHOW_SETTINGS = 'SHOW_SETTINGS'
export const HIDE_SETTINGS = 'HIDE_SETTINGS'

export function showSettings() {
  return {
    type: SHOW_SETTINGS,
    status: true
  }
}

export function hideSettings() {
  return {
    type: HIDE_SETTINGS,
    status: false
  }
}
