import { UPDATE_ENGINES } from '../actions/search-engines'

const initialState = {
  engines: []
}

export default function (state = initialState, action) {
  const { type, engines } = action
  switch (type) {
    case UPDATE_ENGINES:
      return {
        ...state,
        engines
      }
    default:
      return state
  }
}
