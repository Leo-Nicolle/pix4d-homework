import { mapState } from "vuex";
import mapPointerEvents from "./map-pointer-events";
import eventBus from "../js/event-bus";

/*
Any component which displays content on the map should implement Module mixin
*/
const module = {
  mixins: [mapPointerEvents],
  data() {
    return {
      myMode: "",
      dataToSave: []
    };
  },
  computed: {
    ...mapState(["mode", "modes", "cursor", "hovered", "selected"]),
    isMyMode: function() {
      return this.mode === this.myMode;
    }
  },
  mounted() {
    eventBus.on("save", this.saveState);
    eventBus.on("load", this.loadState);
  },
  beforeDestroy() {
    this.$store.commit("deleteMode", this.myMode);
    eventBus.off("save");
    eventBus.off("load");
  },
  methods: {
    initiate(mode) {
      this.myMode = mode;
      this.$store.commit("addMode", this.myMode);
    },
    saveState() {
      const stateToSave = this.dataToSave.reduce((stateToSave, key) => {
        stateToSave[key] = this.$data[key];
        return stateToSave;
      }, {});
      localStorage.setItem(this.myMode, JSON.stringify(stateToSave));
    },
    loadState() {
      const stateToLoad = localStorage.getItem(this.myMode);
      if (!stateToLoad) return;
      Object.entries(JSON.parse(stateToLoad)).forEach(([key, value]) => {
        this.$data[key] = value;
      });
    }
  }
};

export default module;
