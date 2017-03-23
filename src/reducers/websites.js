import sha1 from 'sha1'

import { INITIAL_DATA, ADD_WEBSITE, DELETE_WEBSITE } from '../actions/websites'

/*const getWebsites = () => {
  try {
    const websites = JSON.parse(window.localStorage.getItem('websites'))
    if (Array.isArray(websites)) {
      if (websites[0] && !websites[0].id) {
        websites.map(item => {
          item.id = sha1(item.name + Math.random())
          return item
        })
        window.localStorage.setItem('websites', JSON.stringify(websites))
      }
      return websites
    } else {
      return []
    }
  } catch (error) {
    
  }
}*/
/*const getClassifiedWebsites = () => {
  try {
    let classified = JSON.parse(window.localStorage.getItem('classified'))
    if (!Array.isArray(classified)) {
      classified = [{
        name: 'unclassified',
        set: getWebsites()
      }]
      window.localStorage.setItem('classified', JSON.stringify(classified))
    }
    return classified
    
  } catch (error) {
    
  }
}
*/
/*const getWebsites = async function () {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('websites', result => {
      if (result) {
        resolve(result)
      } else {
        try {
          let websites = JSON.parse(localStorage.getItem('websites'))
          if (Array.isArray(websites)) {
            if (websites[0] && !websites[0].id) {
              websites.map(item => {
                item.id = sha1(item.name + Math.random())
                return item
              })
              // localStorage.setItem('websites', JSON.stringify(websites))
              localStorage.removeItem('websites')
            }
          } else {
            websites = []
          }
          chrome.storage.sync.set({ websites })
          resolve(websites)
        } catch (error) {
          
        }
      }
    })
  })
}
const getClassifiedWebsites = async function () {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('classified', async function (result) {
      if (result) {
        resolve(result)
      } else {
        let classified = JSON.parse(window.localStorage.getItem('classified'))
        if (!Array.isArray(classified)) {
          const all = getWebsites()
          classified = [{
            name: 'unclassified',
            set: all
          }]
          localStorage.removeItem('classified')
        }
        chrome.storage.sync.set({ classified })
        resolve(classified)
      }
    })
  })
}*/

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