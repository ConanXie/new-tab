import shortid from 'shortid'

import defaultEngines from '../modules/Search/search-engines'

export const UPDATE_ENGINES = 'UPDATE_ENGINES'

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
        const temp = [...defaultEngines]
        // 简体中文以外去掉百度与搜狗
        if (chrome.i18n.getUILanguage() !== 'zh-CN') {
          temp.splice(1, 2)
        }
        temp.map(engine => {
          engine.id = shortid.generate()
          engine.isDefault = false
          return engine
        })
        temp[0].isDefault = true
        resolve(temp)
        // save the default engines to chrome storage sync
        chrome.storage.sync.set({ engines: temp })
      }
    })
  })
}

export function initialData() {
  return async dispatch => {
    const engines = await getEngines()
    dispatch({
      type: UPDATE_ENGINES,
      engines
    })
  }
}

export function addEngine(name, link) {
  return (dispatch, getState) => {
    const current = getState().searchEngines.engines

    const newEngine = { 
      id: shortid.generate(),
      name,
      link,
      isDefault: false
    }

    const added = [...current, newEngine]
    chrome.storage.sync.set({ engines: added })

    dispatch({
      type: UPDATE_ENGINES,
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
      type: UPDATE_ENGINES,
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
      type: UPDATE_ENGINES,
      engines: update
    })
  }
}

export function makeDefault(index) {
  return (dispatch, getState) => {
    const { engines } = getState().searchEngines

    const update = [...engines]
    for (let i = 0; i < update.length; i++) {
      if (update[i].isDefault) {
        update[i].isDefault = false
        break
      }
    }
    update[index].isDefault = true
    chrome.storage.sync.set({ engines: update })

    dispatch({
      type: UPDATE_ENGINES,
      engines: update
    })
  }
}

export function moveDown(index) {
  return (dispatch, getState) => {
    const { engines } = getState().searchEngines

    const update = [...engines]
    update.splice(index + 1, 0, update.splice(index, 1)[0])
    chrome.storage.sync.set({ engines: update })
    
    dispatch({
      type: UPDATE_ENGINES,
      engines: update
    })
  }
}

export function moveUp(index) {
  return (dispatch, getState) => {
    const { engines } = getState().searchEngines

    const update = [...engines]
    update.splice(index - 1, 0, update.splice(index, 1)[0])
    chrome.storage.sync.set({ engines: update })

    dispatch({
      type: UPDATE_ENGINES,
      engines: update
    })
  }
}
