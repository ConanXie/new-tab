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
    /*classifications.push({
      name,
      set: []
    })*/
    classifications.splice(classifications.length - 1, 0, {
      name,
      set: []
    })
    console.log(classifications)
    ls.setItem('classified', JSON.stringify(classifications))
  }
}

export function deleteClassification(index) {
  return (dispatch, getState) => {
    const classifications = getState().websites.classifiedStore
    classifications.splice(index, 1)
    console.log(classifications)
    ls.setItem('classified', JSON.stringify(classifications))
    /*dispatch({
      type: 'DELETE_CLASSIFICATION'
    })*/
  }
}

export function updatePosition(origin, index, originArea, newArea, wrap) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    const classifications = getState().websites.classifiedStore
    if (!originArea) {
      websites.splice(index, 0, websites.splice(origin, 1)[0])
      ls.setItem('websites', JSON.stringify(websites))
    } else {
      const originAreaIndex = Array.prototype.indexOf.call(wrap.childNodes, originArea.parentNode)
      const originWebsites = classifications[originAreaIndex].set
      if (!newArea) {
        originWebsites.splice(index, 0, originWebsites.splice(origin, 1)[0])
      } else {
        const newAreaIndex = Array.prototype.indexOf.call(wrap.childNodes, newArea.parentNode)
        const item = originWebsites.splice(origin, 1)[0]
        const newWebsites = classifications[newAreaIndex].set
        newWebsites.splice(index, 0, item)

      }
      ls.setItem('classified', JSON.stringify(classifications))
    }
  }
}

export function changeClassificationName(index, value) {
  return (dispatch, getState) => {
    const classifications = getState().websites.classifiedStore
    classifications[index].name = value
    ls.setItem('classified', JSON.stringify(classifications))
  }
}