import sha1 from 'sha1'

const getWebsites = () => {
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
}

const websites = getWebsites()

const getClassifiedWebsites = () => {
  try {
    let classified = JSON.parse(window.localStorage.getItem('classified'))
    if (!Array.isArray(classified)) {
      classified = [{
        name: 'unclassified',
        set: websites
      }]
      window.localStorage.setItem('classified', JSON.stringify(classified))
    }
    return classified
    
  } catch (error) {
    
  }
}

const initialState = {
  store: websites,
  classifiedStore: getClassifiedWebsites()
}

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}