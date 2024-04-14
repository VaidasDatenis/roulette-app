<template>
  <div class="events-container">
    <span class="events-title">Events</span>
    <div v-if="eventResults?.length" class="event-results">
      <EventInput
        v-for="result in eventResults"
        :key="result.message"
        :event-message="result.message"
      />
    </div>
    <SpinnerComponent v-if="isSpinning" />
    <EventInput
      v-if="nextGameCountdown"
      :event-message="`${countDownText}${nextGameCountdown} sec`"
    />
    <EventInput
      v-if="loading && currentGameResult && !nextGameCountdown"
      :event-message="`${isLoadingText}`"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { store } from "@/store/state";
import EventInput from "./EventInput.vue";
import { LogEventEntry, NextGame } from "@/interfaces/interfaces";
import { Subscription } from "rxjs";
import {
  getCountdown,
  getCurrentGameResult,
  getEventLogs,
  isLoading,
  getShowSpinner,
} from "@/store/selectors";
import SpinnerComponent from "./SpinnerComponent.vue";

const nextGameCountdown = ref<number | null>(null);
const currentGameResult = ref<NextGame | null>(null);
const eventResults = ref<LogEventEntry[] | null>([]);
const loading = ref<boolean>(false);
const isSpinning = ref<boolean>(false);

let subscription: Subscription;

const isLoadingText = computed(() => {
  return `Game ${currentGameResult.value?.id} wheel is spinning...`;
});

const countDownText = computed(() => {
  return `Game ${currentGameResult.value?.id} will start in `;
});

onMounted(() => {
  subscription = store.subscribe((state) => {
    nextGameCountdown.value = getCountdown(state) ?? null;
    currentGameResult.value = getCurrentGameResult(state) ?? null;
    eventResults.value = getEventLogs(state) ?? null;
    loading.value = isLoading(state);
    isSpinning.value = getShowSpinner(state);
  });
});

onUnmounted(() => {
  if (subscription) subscription.unsubscribe();
});
</script>
<style scoped lang="scss">
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
