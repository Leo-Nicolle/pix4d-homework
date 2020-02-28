import { mapState } from "vuex";
import mapPointerEvents from "./map-pointer-events";
const module = {
  mixins: [mapPointerEvents],
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
    this.$store.commmit("deleteMode", this.myMode);
  },
  methods: {
    initiate(mode) {
      this.myMode = mode;
      this.$store.commit("addMode", this.myMode);
    }
  }
};

export default module;
