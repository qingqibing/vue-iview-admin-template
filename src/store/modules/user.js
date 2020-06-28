import { userLoginApi, userLogOutApi, getUserInfoApi } from '@/api/personal-center/user'
import { getToken, setToken, removeToken } from '@/helpers/auth'

const state = {
  token: getToken(),
  user: null,
  avatar: '',
  rights: [],
  roles: []
}

const getters = {}

const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_RIGHTS: (state, rights) => {
    state.rights = rights
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  userLogin: async ({ commit }, { username, password, captchaCode, captchaId }) => {
    try {
      const data = await userLoginApi(username, password, captchaCode, captchaId)
      const { access_token, token_type, expires_at } = data
      if (access_token) {
        const token = `${token_type} ${access_token}`
        setToken(token)
        commit('SET_TOKEN', token)
      }

      return data
    } catch (err) {
      console.log(err) // eslint-disable-line
      return Promise.reject(err)
    }
  },

  getUserInfo: async ({ commit, state }) => {
    try {
      const token = state.token
      const response = await getUserInfoApi(token)
      const { code, data } = response
      if (code !== 20000) return false
      // const { rights, roles, user } = data

      // commit('SET_RIGHTS', rights)
      // commit('SET_ROLES', roles)
      commit('SET_ROLES', ['super_admin', 'admin'])
      commit('SET_USER', data)

      return data
    } catch (err) {
      console.log(err) // eslint-disable-line
      return Promise.reject(err)
    }
  },

  userLogOut: async ({ commit, state }) => {
    try {
      const response = await userLogOutApi()

      if (response.code === 20000) {
        commit('SET_TOKEN', '')
        commit('SET_RIGHTS', [])
        commit('SET_ROLES', [])
        commit('SET_USER', null)
        removeToken()
      }

      return response
    } catch (err) {
      console.log(err) // eslint-disable-line
      return Promise.reject(err)
    }
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_RIGHTS', [])
      commit('SET_ROLES', [])
      commit('SET_USER', null)
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
