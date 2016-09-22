import { GET_SETTINGS } from '../actions/settings'

const initialState = {
  data: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SETTINGS:
      return {
        ...state,
        data: action.settings
      }
    default:
      return state
  }
}