import {
  GET_ENGINES,
  ADD_ENGINE,
  DELETE_ENGINE,
  UPDATE_ENGINE,
  SET_DEFAULT
} from '../actions/search-engines'

const initialState = {
  engines: [],
  defaultIndex: undefined
}

export default function (state = initialState, action) {
  const { type, engines, defaultIndex } = action
  switch (type) {
    case GET_ENGINES:
      return {
        ...state,
        engines,
        defaultIndex
      }
    case SET_DEFAULT:
      return {
        ...state,
        defaultIndex
      }
    case ADD_ENGINE:
    case DELETE_ENGINE:
    case UPDATE_ENGINE:
      return {
        ...state,
        engines: action.engines
      }
    default:
      return state
  }
}