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
    console.log(websites)
    ls.setItem('websites', JSON.stringify(websites))
  }
}

export function deleteWebsite(store) {
  return (dispatch, getState) => {
    const websites = getState().websites.store
    console.log(websites, store)
    // websites.splice(index, 1)
    // console.log(websites)
    // ls.setItem('websites', JSON.stringify(websites))
  }
}