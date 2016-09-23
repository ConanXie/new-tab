import { SAVE_ENGINE } from '../actions/search-engine'

/**
 * initial state from localStorage
 */
const getEngine = () => {
  let engine
  try {
    engine = JSON.parse(window.localStorage.getItem('currentEngine'))
    if (engine) return engine
    else return {}
  } catch (error) {
    
  }
}

const initialState = {
  currentEngine: getEngine()
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_ENGINE:
      return {
        currentEngine: action.engine
      }
    default:
      return state
  }
}