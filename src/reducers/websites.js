import { INITIAL_DATA, ADD_WEBSITE, DELETE_WEBSITE } from '../actions/websites'

const initialState = {
  isEmpty: false,
  store: [],
  classifiedStore: [{
    name: 'unclassified',
    set: []
  }]
}

export default function (state = initialState, action) {
  switch (action.type) {
    case INITIAL_DATA:
    case ADD_WEBSITE:
    case DELETE_WEBSITE:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}