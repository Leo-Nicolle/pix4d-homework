import EventEmitter from "events";

/*
   Any component which interracts with the map should implement MapContainer mixin
*/
const mapEventsBus = new EventEmitter();
const mapPointerEvents = {
  data() {
    return {
      mapEventsBus
    };
  },
  mounted() {
    this.mapEventsBus.on("mousemove", this.onMapMouseMove);
    this.mapEventsBus.on("mouseup", this.onMapMouseUp);
    this.mapEventsBus.on("mousedown", this.onMapMouseDown);
    this.mapEventsBus.on("click", this.onMapClick);
    this.mapEventsBus.on("transform-change", this.onMapTransformChange);
  },
  methods: {
    onMapMouseUp() {},
    onMapMouseDown() {},
    onMapMouseMove() {},
    onMapClick() {},
    onMapTransformChange() {}
  },
  beforeDestroy() {
    this.mapEventsBus.off("mousemove", this.onMapMouseMove);
    this.mapEventsBus.off("mouseup", this.onMapMouseUp);
    this.mapEventsBus.off("mousedown", this.onMapMouseDown);
    this.mapEventsBus.off("click", this.onMapClick);
    this.mapEventsBus.off("transform-change", this.onMapTransformChange);
  }
};

export default mapPointerEvents;
