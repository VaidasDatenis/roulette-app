<template>
  <div class="board-component">
    <select class="game-input" v-model="configId">
      <option disabled value="">Please select one</option>
      <option value="1">Single zero</option>
      <option value="2">Double zero</option>
    </select>
    <div class="roulette-board">
      <RouletteNumber
        v-for="item in numberColors"
        :key="item.rouletteNumber"
        :number="item.rouletteNumber"
        :color="item.rouletteColor"
        :isWinning="item.rouletteResult === winningNumber"
        :isSelected="item.rouletteNumber === setSelectedNumber"
        :isResultMatch="
          item.rouletteResult === winningNumber &&
          item.rouletteNumber === setSelectedNumber
        "
        @select="handleSelect"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from "vue";
import {
  updateConfigurationId,
  selectRouletteNumber,
  state$,
  store,
} from "@/store";
import RouletteNumber from "./RouletteNumber.vue";
import { RouletteNumberProps } from "@/interfaces/interfaces";

export default defineComponent({
  components: {
    RouletteNumber,
  },
  setup() {
    const configId = ref("");
    const numberColors = ref<RouletteNumberProps[] | null>(null);
    const winningNumber = ref<number | null>(null);
    const setSelectedNumber = ref<string | null>(null);
    const handleSelect = (selectedNumber: string) => {
      selectRouletteNumber.next(selectedNumber);
      setSelectedNumber.value = selectedNumber;
    };
    onMounted(() => {
      const subscription = state$.subscribe((state) => {
        configId.value = state.configurationId ? state.configurationId : "";
        numberColors.value = state.rouletteNumbers ?? null;
        winningNumber.value = state.gameResults?.result ?? null;
        setSelectedNumber.value = state.selectedRouletteNumber ?? null;
      });
      onUnmounted(() => {
        subscription.unsubscribe();
      });
    });
    watch(configId, (newValue) => {
      if (store.value.configurationId !== newValue) {
        updateConfigurationId.next(newValue);
      }
    });
    return {
      configId,
      numberColors,
      winningNumber,
      setSelectedNumber,
      handleSelect,
    };
  },
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
