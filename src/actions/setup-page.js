export const SHOW_SETUP = 'SHOW_SETUP'
export const HIDE_SETUP = 'HIDE_SETUP'

export function showSetup() {
  return {
    type: SHOW_SETUP,
    status: true
  }
}

export function hideSetup() {
  return {
    type: HIDE_SETUP,
    status: false
  }
}