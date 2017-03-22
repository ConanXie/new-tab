import sha1 from 'sha1'

const ls = window.localStorage
const checkLink = /^http(s)?:\/\//

export const ADD_WEBSITE = 'ADD_WEBSITE'
export function addWebsite(name, link, cIndex) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    const classifications = getState().websites.classifiedStore
    const nw = {
      id: sha1(name + Math.random()),
      name,
      link: checkLink.test(link) ? link : `http://${link}`
    }
    websites.push(nw)
    classifications[cIndex].set.push(nw)
    ls.setItem('websites', JSON.stringify(websites))
    ls.setItem('classified', JSON.stringify(classifications))
  }
}

export function deleteWebsite(index, cIndex) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    const classifications = getState().websites.classifiedStore
    if (cIndex === undefined) {
      // console.log(websites[index])
      const id = websites[index].id
      websites.splice(index, 1)
      for (let i = 0; i < classifications.length; i++) {
        for (let j = 0; j < classifications[i].set.length; j++) {
          if (classifications[i].set[j].id === id) {
            classifications[i].set.splice(j, 1)
            break
          }
        }
      }
    } else {
      // console.log(classifications[cIndex].set[index])
      const id = classifications[cIndex].set[index].id
      classifications[cIndex].set.splice(index, 1)
      for (let i = 0; i < websites.length; i++) {
        if (websites[i].id === id) {
          websites.splice(i, 1)
          break
        }
      }
    }
    ls.setItem('websites', JSON.stringify(websites))
    ls.setItem('classified', JSON.stringify(classifications))
  }
}

export function editWebsite(index, name, link, cIndex) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    const classifications = getState().websites.classifiedStore
    if (cIndex === undefined) {
      websites[index].name = name
      websites[index].link = checkLink.test(link) ? link : `http://${link}`
      const id = websites[index].id

      for (let i = 0; i < classifications.length; i++) {
        for (let j = 0; j < classifications[i].set.length; j++) {
          let item = classifications[i].set[j]
          if (item.id === id) {
            item.name = name
            item.link = websites[index].link
            break
          }
        }
      }
    } else {
      const item = classifications[cIndex].set[index]
      item.name = name
      item.link = checkLink.test(link) ? link : `http://${link}`
      
      const id = item.id
      for (let i = 0; i < websites.length; i++) {
        if (websites[i].id === id) {
          websites[i].name = name
          websites[i].link = item.link
          break
        }
      }
    }
    ls.setItem('websites', JSON.stringify(websites))
    ls.setItem('classified', JSON.stringify(classifications))
  }
}

export function addEmptyClassification(name) {
  return (dispatch, getState) => {
    const classifications = getState().websites.classifiedStore
    classifications.splice(classifications.length - 1, 0, {
      name,
      set: []
    })
    ls.setItem('classified', JSON.stringify(classifications))
  }
}

export function deleteClassification(index) {
  return (dispatch, getState) => {
    const classifications = getState().websites.classifiedStore
    classifications.splice(index, 1)
    ls.setItem('classified', JSON.stringify(classifications))
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