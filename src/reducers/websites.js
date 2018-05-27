import {ADD_WEBSITE, DELETE_WEBSITE, INITIAL_DATA, UNDO} from '../actions/websites'

const initialState = {
    isEmpty: false,
    store: [],
    classifiedStore: [{
        name: 'unclassified',
        set: []
    }]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case INITIAL_DATA:
        case ADD_WEBSITE:
        case DELETE_WEBSITE:
        case UNDO:
            return {
                ...state,
                ...action.data
            };
        default:
            return state
    }
}
