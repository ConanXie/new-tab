const getWebsites = () => {
  let websites
  try {
    websites = JSON.parse(window.localStorage.getItem('websites'))
    return websites ? websites : []
  } catch (error) {
    
  }
}

const initialState = {
  store: getWebsites()
}

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}