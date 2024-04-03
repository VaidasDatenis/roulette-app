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
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from "vue";
import { updateConfigurationId, state$, store } from "@/store";
import RouletteNumber from "./RouletteNumber.vue";
import { RouletteNumberProps } from "@/interfaces/interfaces";

export default defineComponent({
  components: {
    RouletteNumber,
  },
  setup() {
    const configId = ref("");
    const numberColors = ref<RouletteNumberProps[] | null>(null);
    onMounted(() => {
      const subscription = state$.subscribe((state) => {
        configId.value = state.configurationId ? state.configurationId : "";
        numberColors.value = state.rouletteNumbers
          ? state.rouletteNumbers
          : null;
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
