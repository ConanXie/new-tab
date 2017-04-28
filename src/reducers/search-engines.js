import {
  GET_ENGINES,
  ADD_ENGINE,
  DELETE_ENGINE,
  UPDATE_ENGINE,
  SET_DEFAULT
} from '../actions/search-engines'

const initialState = {
  engines: []
}

export default function (state = initialState, action) {

  switch (action.type) {
    case GET_ENGINES:
    case ADD_ENGINE:
    case DELETE_ENGINE:
    case UPDATE_ENGINE:
    case SET_DEFAULT:
      return {
        ...state,
        engines: action.engines
      }
    default:
      return state
  }
}