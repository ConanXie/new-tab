import defaultEngines from '../modules/Search/search-engines'

// 简体中文以外去掉百度与搜狗
if (navigator.language !== 'zh-CN') {
  defaultEngines.splice(1, 2)
}

export const GET_ENGINES = 'GET_ENGINES'
export const ADD_ENGINE = 'ADD_ENGINE'
export const DELETE_ENGINE = 'DELETE_ENGINE'
export const UPDATE_ENGINE = 'UPDATE_ENGINE'
export const SET_DEFAULT = 'SET_DEFAULT'

/**
 * get data from chrome storage sync
 */
function getEngines() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('engines', result => {
      const { engines } = result
      if (Array.isArray(engines)) {
        resolve(engines)
      } else {
        resolve(defaultEngines)
        // save the default engines to chrome storage sync
        chrome.storage.sync.set({ engines: defaultEngines })
      }
    })
  })
}

/**
 * Get default engine index
 */
function getDefaultIndex() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('defaultEngineIndex', result => {
      const { defaultEngineIndex } = result
      if (typeof defaultEngineIndex === 'number') {
        resolve(defaultEngineIndex)
      } else {
        resolve(0)
        chrome.storage.sync.set({ defaultEngineIndex: 0 })
      }
    })
  })
}

export function initialData() {
  return async dispatch => {
    const engines = await getEngines()
    const defaultIndex = await getDefaultIndex()
    dispatch({
      type: GET_ENGINES,
      defaultIndex,
      engines
    })
  }
}

export function addEngine(name, link) {
  return (dispatch, getState) => {
    const current = getState().searchEngines.engines

    const newEngine = { name, link }

    const added = [...current, newEngine]
    chrome.storage.sync.set({ engines: added })

    dispatch({
      type: ADD_ENGINE,
      engines: added
    })
  }
}

export function deleteEngine(index) {
  return (dispatch, getState) => {
    const current = getState().searchEngines.engines
    
    const copy = [...current]
    copy.splice(index, 1)
    chrome.storage.sync.set({ engines: copy })
    
    dispatch({
      type: DELETE_ENGINE,
      engines: copy
    })
  }
}

export function updateEngine(index, name, link) {
  return (dispatch, getState) => {
    const current = getState().searchEngines.engines

    const update = [...current]
    update[index].name = name
    update[index].link = link
    chrome.storage.sync.set({ engines: update })

    dispatch({
      type: UPDATE_ENGINE,
      engines: update
    })
  }
}

export function setDefault(index) {
  chrome.storage.sync.set({ defaultEngineIndex: index })
  return {
    type: SET_DEFAULT,
    defaultIndex: index
  }
}