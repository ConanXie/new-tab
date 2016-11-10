const ls = window.localStorage

export const ADD_WEBSITE = 'ADD_WEBSITE'

export function addWebsite(name, link, icon) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    websites.push({
      name,
      link,
      icon
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

export function editWebsite(index, name, link, icon) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    websites[index] = {
      name,
      link,
      icon
    }
    ls.setItem('websites', JSON.stringify(websites))
  }
}