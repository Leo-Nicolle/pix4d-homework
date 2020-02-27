import { mapState } from "vuex";

const module = {
  data() {
    return {
      myMode: ""
    };
  },
  computed: {
    ...mapState([
      "mode",
      "modes",
      "cursor",
      "hovered",
      "selected",
      "leafletMap"
    ]),
    isMyMode: function() {
      return this.mode === this.myMode;
    }
  },

  methods: {
    initiate(mode) {
      this.myMode = mode;
      this.$store.commit("addMode", this.myMode);
    }
  }
};

export default module;
