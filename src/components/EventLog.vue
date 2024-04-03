<template>
  <div class="events-container">
    <span class="events-title">Events</span>
    <div class="event-results" v-if="eventResults?.length">
      <EventInput
        v-for="result in eventResults"
        :key="result.message"
        :eventMessage="result.message"
      />
    </div>
    <EventInput
      v-if="nextGameCountdown"
      :eventMessage="`${countDownText}${nextGameCountdown} sec`"
    />
    <EventInput
      v-if="loading && currentGameResult && !nextGameCountdown"
      :eventMessage="`${isLoadingText}`"
    />
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { state$ } from "@/store/state";
import { NextGame, LogEventEntry } from "@/interfaces/interfaces";
import EventInput from "./EventInput.vue";
export default defineComponent({
  components: { EventInput },
  setup() {
    const nextGameCountdown = ref<number | null>(null);
    const currentGameResult = ref<NextGame | null>(null);
    const eventResults = ref<LogEventEntry[] | null>([]);
    const loading = ref<boolean>();
    onMounted(() => {
      const subscription = state$.subscribe((state) => {
        nextGameCountdown.value = state.countdownValue
          ? state.countdownValue
          : null;
        currentGameResult.value = state.nextGame ? state.nextGame : null;
        eventResults.value = state.eventLogs;
        loading.value = state.loading;
      });
      onUnmounted(() => {
        subscription.unsubscribe();
      });
    });
    const isLoadingText = computed(() => {
      return `Game ${currentGameResult.value?.id} wheel is spinning...`;
    });
    const countDownText = computed(() => {
      return `Game ${currentGameResult.value?.id} will start in `;
    });
    return {
      currentGameResult,
      nextGameCountdown,
      eventResults,
      loading,
      isLoadingText,
      countDownText,
    };
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

  .event-results {
    display: flex;
    flex-direction: column;
  }
}
</style>
