export default {
  namespaced: true,
  state: {
    errors: []
  },
  getters: {
    errors: state => state.errors
  },
  mutations: {
    CLEAR_ERRORS(state) {
      state.errors = [];
    }
  },
  actions: {
    ADD_TO_ERRORS({ state }, payload) {
      if (!payload) return;
      state.errors.push(payload);
    }
  }
}