const ls = window.localStorage

export const SAVE_ENGINE = 'SAVE_ENGINE'
/**
 * save current search engine to localStorage
 */
export function saveToLocalStorage(data) {
  return dispatch => {
    ls.setItem('currentEngine', JSON.stringify(data))
  }
}
/**
 * save current search engine to props
 */
export function saveEngine(data) {
  return {
    type: SAVE_ENGINE,
    engine: data
  }
}