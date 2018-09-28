module.exports = axios => {
  return {

    // 根据 ldbId set home
    setHome: (params) => {
      return axios.post('/api/home', params)
    },

    // 根据 ldbId reset home
    resetHome: (params) => {
      return axios.put('/api/home', params)
    },

    // 获取 home count
    getHomeCount: (params) => {
      return axios.get('/api/home/count', { params })
    },

    // 根据 user 获取 home
    getHome: (params) => {
      return axios.get('/api/home', { params })
    }
  }
}
