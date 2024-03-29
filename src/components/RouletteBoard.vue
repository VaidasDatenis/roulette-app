<template>
  <div class="boar-component">
    <input class="game-url-input" v-model="configId" />
    <div class="roulette-board">
      <RouletteNumber
        v-for="item in numberColors"
        :key="item.number"
        :number="item.number"
        :color="item.color"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from "vue";
import { actions, state$ } from "@/store";
import RouletteNumber from "./RouletteNumber.vue";
import { BASE_URL } from "@/utils/utils";
import { RouletteNumberProps } from "@/interfaces/interfaces";

export default defineComponent({
  components: {
    RouletteNumber,
  },
  setup() {
    const configId = ref(`${BASE_URL}1`);
    const numberColors = ref<RouletteNumberProps[]>([]);
    onMounted(() => {
      const subscription = state$.subscribe((state) => {
        if (state.rouletteNumbers) {
          numberColors.value = state.rouletteNumbers;
        }
      });
      // Dispatch action to update configuration ID based on local state
      actions.updateConfigurationId.next(configId.value);
      onUnmounted(() => {
        subscription.unsubscribe();
      });
    });
    watch(configId, (newValue) => {
      actions.updateConfigurationId.next(newValue);
    });
    return {
      configId,
      numberColors,
    };
  },
});
</script>
<style scoped lang="scss">
.boar-component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .game-url-input {
    width: 40%;
    height: 30px;
    margin-bottom: 15px;
    border: 1px solid rgb(206, 206, 206);
    border-radius: 5px;
  }
  .roulette-board {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
  }
}
</style>
