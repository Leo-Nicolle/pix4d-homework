import { mapState } from "vuex";
import mapPointerEvents from "./map-pointer-events";
import loadSave from "./load-save";
/*
Any component which displays content on the map should implement Module mixin
*/
const module = {
  mixins: [mapPointerEvents, loadSave],
  data() {
    return {
      myMode: ""
    };
  },
  computed: {
    ...mapState(["mode", "modes", "cursor", "hovered", "selected"]),
    isMyMode: function() {
      return this.mode === this.myMode;
    }
  },
  beforeDestroy() {
    this.$store.commit("deleteMode", this.myMode);
  },
  methods: {
    initiate(mode) {
      this.myMode = mode;
      this.$store.commit("addMode", this.myMode);
    },
    saveState(toSerialize) {
      const moduleData = this.dataToSave.reduce((moduleData, key) => {
        moduleData[key] = this.$data[key];
        return moduleData;
      }, {});
      toSerialize[this.myMode] = moduleData;
    },
    loadState(toUnserialize) {
      const dataToLoad = toUnserialize[this.myMode];
      if (!dataToLoad) return;
      Object.entries(dataToLoad).forEach(([key, value]) => {
        this.$data[key] = value;
      });
    }
  }
};

export default module;
