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
import { defineComponent, ref, onMounted, watch } from "vue";
import { map } from "rxjs/operators";
import RouletteNumber from "./RouletteNumber.vue";
import { fetchRouletteConfig } from "@/services/rouletteService";
import { BASE_URL } from "@/utils/utils";

export default defineComponent({
  components: {
    RouletteNumber,
  },
  setup() {
    const configId = ref<string>(`${BASE_URL}1`);
    const numberColors = ref<Array<{ number: number; color: string }>>([]);

    const fetchConfig = () => {
      fetchRouletteConfig(configId.value)
        .pipe(
          map((data) => {
            return data.positionToId.map((num, index) => ({
              number: num,
              color: data.colors[index],
            }));
          })
        )
        .subscribe({
          next: (numberColorMapping) => {
            numberColors.value = numberColorMapping;
          },
          error: (err: Error) =>
            console.error("Failed to fetch roulette config:", err),
        });
    };
    watch(configId, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        fetchConfig();
      }
    });
    onMounted(fetchConfig);
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
