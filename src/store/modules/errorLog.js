const state = {
  logs: ["123"]
}

const mutations = {
  ADD_ERROR_LOG: (state, log) => {
    state.logs.push(log)
  }
}

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
