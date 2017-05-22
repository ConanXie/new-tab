import { SHOW_SETTINGS, HIDE_SETTINGS } from '../actions/settings-page'

const initalState = false

export default function (state = initalState, action) {
  const { type, status } = action
  switch (type) {
    case SHOW_SETTINGS:
    case HIDE_SETTINGS:
      return status
    default:
      return state
  }
}
