import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hovered: null,
    cursor: "",
    mode: "default",
    leafletMap: null,
    selected: null
  },
  mutations: {
    select(state, item) {
      state.selected = item;
    },
    unselect(state, item) {
      state.selected = null;
    },
    hover(state, item) {
      state.hovered = item;
    },
    unhover(state, item) {
      state.hovered = null;
    },
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
    setLeafLetMap(state, map) {
      state.leafletMap = map;
    }
  },
  actions: {},
  modules: {}
});
