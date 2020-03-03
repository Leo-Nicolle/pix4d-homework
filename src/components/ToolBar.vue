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
      <p>Flight Plans</p>
      <button @click="onClickSave">
        Save
      </button>
      <select @change="onSelectChange">
        <option
          v-for="(flightPlan, i) in flightPlans"
          :key="i"
          :selected="i === selectedFlightPlan"
        >
          {{ i }}
        </option>
      </select>
      <button @click="onClickDelete">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Toolbar",
  props: ["flightPlans"],
  computed: {
    ...mapState(["mode", "modes"])
  },
  watch: {
    flightPlans: function(newValue) {
      this.selectedFlightPlan = newValue.length - 1;
    },
    selectedFlightPlan: function(newValue) {
      this.$emit("load-flight-plan", newValue);
    }
  },

  data() {
    return {
      selectedFlightPlan: 0
    };
  },
  methods: {
    onClickMode(buttonMode) {
      this.$store.commit("setMode", buttonMode);
    },
    onClickSave() {
      this.$emit("save-flight-plan");
    },
    onClickDelete() {
      this.$emit("delete-flight-plan", this.selectedFlightPlan);
    },
    onSelectChange(evt) {
      this.selectedFlightPlan = evt.target.value;
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
  margin: 2px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.toolbar > div > button,
select {
  margin: 2px 4px;
}
</style>
