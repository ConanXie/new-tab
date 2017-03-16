const ls = window.localStorage
const checkLink = /^http(s)?:\/\//

export const ADD_WEBSITE = 'ADD_WEBSITE'

export function addWebsite(name, link) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    websites.push({
      name,
      link: checkLink.test(link) ? link : `http://${link}`
    })
    ls.setItem('websites', JSON.stringify(websites))
  }
}

export function deleteWebsite(index) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    websites.splice(index, 1)
    ls.setItem('websites', JSON.stringify(websites))
  }
}

export function editWebsite(index, name, link) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    websites[index] = {
      name,
      link: checkLink.test(link) ? link : `http://${link}`
    }
    ls.setItem('websites', JSON.stringify(websites))
  }
}

export function addEmptyClassification(name) {
  return (dispatch, getState) => {
    const classifications = getState().websites.classifiedStore
    classifications.push({
      name,
      set: []
    })
    console.log(classifications)
    ls.setItem('classified', JSON.stringify(classifications))
  }
}