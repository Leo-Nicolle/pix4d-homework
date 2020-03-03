import eventBus from "../js/event-bus";
/*
   Any component which has things to serialize should extend this mixin
*/
const loadSave = {
  data() {
    return {
      dataToSave: []
    };
  },
  mounted() {
    eventBus.on("save", this.saveState);
    eventBus.on("load", this.loadState);
    eventBus.on("reset", this.resetState);
  },

  beforeDestroy() {
    eventBus.off("save", this.saveState);
    eventBus.off("load", this.loadState);
    eventBus.off("reset", this.resetState);
  },
  methods: {
    saveState() {},
    loadState() {},
    resetState() {}
  }
};
export default loadSave;
