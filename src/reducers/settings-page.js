import { SHOW_SETUP, HIDE_SETUP } from '../actions/setup-page'

const initalState = {
  status: false
}

export default function (state = initalState, action) {
  switch (action.type) {
    case SHOW_SETUP:
      return {
        ...state,
        status: action.status
      }
    case HIDE_SETUP:
      return {
        ...state,
        status: action.status
      }
    default:
      return state
  }
}