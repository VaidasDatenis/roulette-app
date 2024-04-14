<template>
  <span>Statistics table</span>
  <div class="statistics-container">
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
            <td class="category-cold">{{ item.rouletteNumberCount }}</td>
          </template>
          <template
            v-for="item in statistics?.[statsCategoriesEnum.NEUTRAL]"
            :key="item.statisticsResult"
          >
            <td class="category-neutral">{{ item.rouletteNumberCount }}</td>
          </template>
          <template
            v-for="item in statistics?.[statsCategoriesEnum.HOT]"
            :key="item.statisticsResult"
          >
            <td class="category-hot">{{ item.rouletteNumberCount }}</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { CategorizedData, StatsCategories } from "@/interfaces/interfaces";
import { store } from "@/store";
import { getColor } from "@/utils/utils";
import { Subscription } from "rxjs";
import { getStatisticsNumbers } from "@/store/selectors";

const statsCategoriesEnum = StatsCategories;
const statistics = ref<CategorizedData | null>(null);
let subscription: Subscription;

onMounted(() => {
  subscription = store.subscribe((state) => {
    statistics.value = getStatisticsNumbers(state);
  });
});

onUnmounted(() => {
  if (subscription) subscription.unsubscribe();
});
</script>
<style scoped lang="scss">
.statistics-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 10%;

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
}
</style>
