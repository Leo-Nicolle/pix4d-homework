import Vue from "vue";
const mapEventsBus = new Vue();
const mapPointerEvents = {
  data() {
    return {
      mapEventsBus
    };
  },
  mounted() {
    this.mapEventsBus.$on("mousemove", this.onMapMouseMove);
    this.mapEventsBus.$on("mouseup", this.onMapMouseUp);
    this.mapEventsBus.$on("mousedown", this.onMapMouseDown);
    this.mapEventsBus.$on("click", this.onMapClick);
  },
  methods: {
    onMapMouseUp() {},
    onMapMouseDown() {},
    onMapMouseMove() {},
    onMapClick() {}
  },
  beforeDestroy() {
    this.mapEventsBus.$off("mousemove");
    this.mapEventsBus.$off("mouseup");
    this.mapEventsBus.$off("mousedown");
    this.mapEventsBus.$off("click");
  }
};

export default mapPointerEvents;
