<template>
  <div class="board-component">
    <select v-model="configId" class="game-input">
      <option disabled value="">Please select one</option>
      <option value="1">Single zero</option>
      <option value="2">Double zero</option>
    </select>
    <div v-if="!numberColors?.length">Loading roulette numbers...</div>
    <div v-else class="roulette-board">
      <RouletteNumber
        v-for="item in numberColors"
        :key="item.rouletteNumber"
        :number="item.rouletteNumber"
        :color="item.rouletteColor"
        :is-winning="item.rouletteResult === winningNumber"
        :is-selected="item.rouletteNumber === setSelectedNumber"
        :is-result-match="
          item.rouletteResult === winningNumber &&
          item.rouletteNumber === setSelectedNumber
        "
        @select="handleSelect"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { configurationChange$, selectRouletteNumber$, store } from "@/store";
import RouletteNumber from "./RouletteNumber.vue";
import {
  getConfigurationId,
  getRouletteNumbers,
  getUserSelectedNumber,
  getWinningNumber,
} from "@/store/selectors";
import { Subscription } from "rxjs";
import { RouletteNumberProps } from "@/interfaces/interfaces";

const configId = ref<string>(store.value.configurationId);
const numberColors = ref<RouletteNumberProps[]>([]);
const winningNumber = ref<number | null>(null);
const setSelectedNumber = ref<string | null>("");

let subscription: Subscription;

onMounted(() => {
  subscription = store.subscribe((state) => {
    configId.value = getConfigurationId(state);
    numberColors.value = getRouletteNumbers(state) ?? [];
    winningNumber.value = getWinningNumber(state) ?? null;
    setSelectedNumber.value = getUserSelectedNumber(state) ?? "";
  });
});

onUnmounted(() => {
  if (subscription) subscription.unsubscribe();
});

const handleSelect = (selectedNumber: string) => {
  selectRouletteNumber$.next(selectedNumber);
  setSelectedNumber.value = selectedNumber;
};

watch(configId, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    configurationChange$.next(newValue);
  }
});
</script>
<style scoped lang="scss">
.board-component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .game-input {
    width: 10rem;
    margin-bottom: 15px;
  }

  .roulette-board {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
  }
}
</style>
