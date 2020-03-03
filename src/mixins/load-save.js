import eventBus from "../js/event-bus";

const loadSave = {
  data() {
    return {
      dataToSave: []
    };
  },
  mounted() {
    eventBus.on("save", this.saveState);
    eventBus.on("load", this.loadState);
    this.loadState();
  },

  beforeDestroy() {
    eventBus.off("save", this.saveState);
    eventBus.off("load", this.loadState);
  },
  methods: {
    saveState() {},
    loadState() {}
  }
};
export default loadSave;
