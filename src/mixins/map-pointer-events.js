import EventEmitter from "events";

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
  },
  methods: {
    onMapMouseUp() {},
    onMapMouseDown() {},
    onMapMouseMove() {},
    onMapClick() {}
  },
  beforeDestroy() {
    this.mapEventsBus.off("mousemove", this.onMapMouseMove);
    this.mapEventsBus.off("mouseup", this.onMapMouseUp);
    this.mapEventsBus.off("mousedown", this.onMapMouseDown);
    this.mapEventsBus.off("click", this.onMapClick);
  }
};

export default mapPointerEvents;
