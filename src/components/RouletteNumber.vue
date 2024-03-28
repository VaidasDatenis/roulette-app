<template>
  <button
    class="roulette-number"
    :style="{
      backgroundColor: color,
    }"
  >
    {{ number }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    number: Number,
    color: String,
  },
  setup(props) {
    return { ...props };
  },
});
</script>
<style lang="scss">
.roulette-number {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
  font-weight: bold;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
</style>
