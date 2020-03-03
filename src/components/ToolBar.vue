<template>
  <div class="toolbar">
    <div>
      <p>modes</p>
      <button
        v-for="buttonMode in modes"
        :key="buttonMode"
        :class="mode == buttonMode ? 'button-active' : ''"
        @click="onClickMode(buttonMode)"
      >
        {{ buttonMode }}
      </button>
    </div>
    <div>
      <button @click="onClickSave">
        Save
      </button>
      <button @click="onClickLoad">
        Load
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Toolbar",
  computed: mapState(["mode", "modes"]),
  methods: {
    onClickMode(buttonMode) {
      this.$store.commit("setMode", buttonMode);
    },
    onClickSave() {
      this.$emit("save");
    },
    onClickLoad() {
      this.$emit("load");
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  margin: 2px 4px;
}
.toolbar > div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.toolbar > div > button {
  margin: 2px 4px;
}
</style>
