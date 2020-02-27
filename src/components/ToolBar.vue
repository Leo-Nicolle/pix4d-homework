<template>
  <div class="toolbar">
    <p>modes</p>
    <button
      v-for="buttonMode in modes"
      :key="buttonMode"
      :class="mode == buttonMode ? 'button-active' : ''"
      @click="onClick(buttonMode)"
    >
      {{ buttonMode }}
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Toolbar",
  computed: mapState(["mode", "modes"]),
  methods: {
    onClick(buttonMode) {
      this.$store.commit("setMode", buttonMode);
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.toolbar > button {
  margin: 2px 4px;
}

.selected {
}
</style>
