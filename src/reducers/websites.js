const getWebsites = () => {
  let websites
  try {
    websites = JSON.parse(window.localStorage.getItem('websites'))
    return websites ? websites : []
  } catch (error) {
    
  }
}

const getClassifiedWebsites = () => {
  let classified
  try {
    classified = JSON.parse(window.localStorage.getItem('classified'))
    if (!classified) {
      classified = [{
        name: 'unclassified',
        set: getWebsites()
      }]
    }
    return classified
  } catch (error) {
    
  }
}

const initialState = {
  store: getWebsites(),
  classifiedStore: getClassifiedWebsites()
}

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}