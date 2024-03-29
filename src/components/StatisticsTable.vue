<template>
  <table>
    <thead>
      <tr>
        <th></th>
        <th
          class="category-cold"
          :colspan="statistics?.[statsCategoriesEnum.COLD].length"
        >
          Cold
        </th>
        <th
          class="category-neutral"
          :colspan="statistics?.[statsCategoriesEnum.NEUTRAL].length"
        >
          Neutral
        </th>
        <th
          class="category-hot"
          :colspan="statistics?.[statsCategoriesEnum.HOT].length"
        >
          Hot
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Slot</th>
        <template
          v-for="item in statistics?.[statsCategoriesEnum.COLD]"
          :key="item.rouletteNumber"
        >
          <td
            class="board-number-color"
            :style="{ backgroundColor: getColor(item.rouletteColor) }"
          >
            {{ item.rouletteNumber }}
          </td>
        </template>
        <template
          v-for="item in statistics?.[statsCategoriesEnum.NEUTRAL]"
          :key="item.rouletteNumber"
        >
          <td
            class="board-number-color"
            :style="{ backgroundColor: getColor(item.rouletteColor) }"
          >
            {{ item.rouletteNumber }}
          </td>
        </template>
        <template
          v-for="item in statistics?.[statsCategoriesEnum.HOT]"
          :key="item.rouletteNumber"
        >
          <td
            class="board-number-color"
            :style="{ backgroundColor: getColor(item.rouletteColor) }"
          >
            {{ item.rouletteNumber }}
          </td>
        </template>
      </tr>
      <tr>
        <th>Hits</th>
        <template
          v-for="item in statistics?.[statsCategoriesEnum.COLD]"
          :key="item.statisticsResult"
        >
          <td class="category-cold">{{ item.count }}</td>
        </template>
        <template
          v-for="item in statistics?.[statsCategoriesEnum.NEUTRAL]"
          :key="item.statisticsResult"
        >
          <td class="category-neutral">{{ item.count }}</td>
        </template>
        <template
          v-for="item in statistics?.[statsCategoriesEnum.HOT]"
          :key="item.statisticsResult"
        >
          <td class="category-hot">{{ item.count }}</td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import {
  CategorizedData,
  StatsCategories,
  RouletteColors,
} from "@/interfaces/interfaces";
import { state$ } from "@/store";

export default defineComponent({
  setup() {
    const statsCategoriesEnum = StatsCategories;
    const rouletteColorsEnum = RouletteColors;
    const statistics = ref<CategorizedData | null>(null);
    const getColor = (color: string) => {
      if (color === rouletteColorsEnum.RED) return "#ff0000";
      if (color === rouletteColorsEnum.BLACK) return "#000000";
      if (color === rouletteColorsEnum.GREEN) return "#00ff00";
      return "transparent";
    };
    onMounted(() => {
      const subscription = state$.subscribe((state) => {
        statistics.value = state.statisticsNumbers;
      });
      onUnmounted(() => {
        subscription.unsubscribe();
      });
    });
    return {
      statsCategoriesEnum,
      statistics,
      getColor,
    };
  },
});
</script>
<style scoped>
.category-cold {
  background-color: #d9edf7;
}
.category-neutral {
  background-color: #f5f5f5;
}
.category-hot {
  background-color: #f2dede;
}
td {
  width: 35px;
}
.board-number-color {
  color: white;
}
</style>
