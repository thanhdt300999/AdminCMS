
export const setItem = (key, value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value)
  }
}

export const removeItem = (key) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key)
  }
}

export const getItem = (key) => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key) || ''
  }
  return ''
}

export const setAccessToken = (value) => {
  setItem('token', value)
}

export const getAccessToken = () => getItem('token')




export const setUserInfo = (value) => {
  setItem('userInfo', value)
}

export const getUserInfo = () => getItem('userInfo')

export const clearAll = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('userInfo')
  }
}
