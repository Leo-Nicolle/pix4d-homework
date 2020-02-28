import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cursor: "",
    mode: "default",
    modes: []
  },
  mutations: {
    setMode(state, mode) {
      state.mode = mode;
    },
    unsetMode(state, mode) {
      state.mode = "default";
    },
    setCursor(state, cursor) {
      state.cursor = cursor;
    },
    unsetCursor(state, mode) {
      state.cursor = "";
    },
    addMode(state, mode) {
      if (state.modes.includes(mode)) return;
      state.modes = state.modes.concat(mode);
    },
    deleteMode(state, mode) {
      state.modes = state.modes.filter(m => m !== mode);
    }
  },
  actions: {},
  modules: {}
});
