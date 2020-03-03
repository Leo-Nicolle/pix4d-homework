<template>
  <div class="help">
    <h3>Help:</h3>
    <div v-if="mode === 'polyline'">
      <p><strong> left click</strong> somewhere to add a point</p>
      <p><strong> left click </strong> on a line to add a point</p>
      <p><strong> right click</strong> on a point to delete it</p>
      <p><strong> drag </strong> lines and points</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Help",
  computed: {
    ...mapState(["mode"])
  }
};
</script>

<style scoped></style>
