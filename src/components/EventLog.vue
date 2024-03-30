<template>
  <div class="events-container">
    <span class="events-title">Events</span>
    <input v-for="log in []" class="game-url-input" type="text" :key="log" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return {};
  },
});
</script>
<style lang="scss">
.events-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0 0 25%;

  .events-title {
    margin: 10px 10px 10px 0;
  }
}
</style>
