<template>
  <div class="boar-component">
    <span>Give an id to {{ configUrl }}</span>
    <input class="game-url-input" :placeholder="configUrl" v-model="configId" />
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
import { updateConfigurationId, state$ } from "@/store";
import RouletteNumber from "./RouletteNumber.vue";
import { BASE_URL } from "@/utils/utils";
import { RouletteNumberProps } from "@/interfaces/interfaces";

export default defineComponent({
  components: {
    RouletteNumber,
  },
  setup() {
    const configUrl = ref(`${BASE_URL}1`);
    const configId = ref("");
    const numberColors = ref<RouletteNumberProps[]>([]);
    onMounted(() => {
      const subscription = state$.subscribe((state) => {
        if (state.configurationId && state.rouletteNumbers) {
          configId.value = state.configurationId;
          numberColors.value = state.rouletteNumbers;
        }
      });
      onUnmounted(() => {
        subscription.unsubscribe();
      });
    });
    watch(configId, (newValue) => {
      updateConfigurationId.next(newValue);
    });
    return {
      configUrl,
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
