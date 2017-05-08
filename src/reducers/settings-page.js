import { SHOW_SETTINGS, HIDE_SETTINGS } from '../actions/settings-page'

const initalState = {
  status: false
}

export default function (state = initalState, action) {
  switch (action.type) {
    case SHOW_SETTINGS:
      return {
        ...state,
        status: action.status
      }
    case HIDE_SETTINGS:
      return {
        ...state,
        status: action.status
      }
    default:
      return state
  }
}