<template>
  <div class="events-container">
    <span class="events-title">Events</span>
    <input class="game-url-input" :value="countdown" type="text" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onUnmounted, ref, watch } from "vue";
import { store } from "@/store/state";
export default defineComponent({
  setup() {
    const countdown = ref<number>(0);
    let intervalId = 0;
    function startCountdown(duration: number) {
      if (intervalId) clearInterval(intervalId);
      countdown.value = duration;
      intervalId = setInterval(() => {
        countdown.value -= 1;
        if (countdown.value <= 0 && intervalId) {
          clearInterval(intervalId);
          intervalId = 0;
        }
      }, 1000);
    }
    watch(
      () => store.value.nextGame?.fakeStartDelta,
      (fakeDeltaValue) => {
        if (fakeDeltaValue) {
          startCountdown(fakeDeltaValue);
        }
      },
      { immediate: true }
    );
    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });
    return { countdown };
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
