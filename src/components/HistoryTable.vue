<template>
  <div class="history-table-content">
    <table>
      <thead>
        <th class="table-header">Date</th>
        <th class="table-header">Game ID</th>
        <th class="table-header">Result</th>
      </thead>
      <tbody>
        <tr v-for="game of historyData" :key="game.gameId" class="table-row">
          <td>{{ game.date }}</td>
          <td>{{ game.gameId }}</td>
          <td>{{ game.gameResult }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { state$ } from "@/store";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { HistoryTableData } from "@/interfaces/interfaces";
export default defineComponent({
  setup() {
    const historyData = ref<HistoryTableData[]>([]);
    onMounted(() => {
      const subscription = state$.subscribe((state) => {
        historyData.value = state.previousGames ?? [];
      });
      onUnmounted(() => {
        subscription.unsubscribe();
      });
    });
    return { historyData };
  },
});
</script>
<style lang="scss">
.history-table-content {
  width: 100%;
  .table-header {
    width: 3%;
    height: 40px;
    border-bottom: 1px solid lightgray;
  }
  .table-row {
    height: 40px;
  }
}
</style>
