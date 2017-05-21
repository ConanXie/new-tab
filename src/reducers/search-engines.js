import {
  GET_ENGINES,
  ADD_ENGINE,
  DELETE_ENGINE,
  UPDATE_ENGINE,
  MAKE_DEFAULT
} from '../actions/search-engines'

const initialState = {
  engines: []
}

export default function (state = initialState, action) {
  const { type, engines } = action
  switch (type) {
    case GET_ENGINES:
    case MAKE_DEFAULT:
    case ADD_ENGINE:
    case DELETE_ENGINE:
    case UPDATE_ENGINE:
      return {
        ...state,
        engines
      }
    default:
      return state
  }
}
