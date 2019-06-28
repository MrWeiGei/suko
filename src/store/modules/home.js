const state = {
  indexTrue: [],
  id: '-1',
}

const mutations = {
  ADD_INDEX_TRUE: (state, index) => {
    if (state.indexTrue.indexOf(index) == -1) {
      state.indexTrue.push(index)
    }
  },
  DEL_INDEX_TRUE: (state) => {
    state.indexTrue = [];
  },
  UPDATEID: (state, id) => {
    state.id = id
  }
}

const actions = {
  addIndexTrue({
    commit
  }, index) {
    commit('ADD_INDEX_TRUE', index);
  },
  delIndexTrue({
    commit
  }) {
    commit('DEL_INDEX_TRUE');
  },
  updateId({
    commit
  }, id) {
    commit('UPDATEID', id);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
