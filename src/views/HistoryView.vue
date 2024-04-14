<template>
  <span>History table</span>
  <div class="history-container">
    <div class="history-table-content">
      <table>
        <thead>
          <th class="table-header">Date</th>
          <th class="table-header">Game ID</th>
          <th class="table-header">Result</th>
        </thead>
        <tbody>
          <tr v-if="!historyData.length">
            <td>There were no games yet</td>
          </tr>
          <tr v-for="game of historyData" :key="game.gameId" class="table-row">
            <td>{{ game.date }}</td>
            <td>{{ game.gameId }}</td>
            <td>{{ game.gameResult }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { getHistoryByConfigurationId$, store } from "@/store";
import { HistoryTableData } from "@/interfaces/interfaces";
import { Subscription } from "rxjs";
import { getHistoryRecords } from "@/store/selectors";

const historyData = ref<HistoryTableData[]>([]);
let subscription: Subscription;

onMounted(() => {
  getHistoryByConfigurationId$.next();
  subscription = store.subscribe((state) => {
    historyData.value = getHistoryRecords(state) ?? [];
  });
});

onUnmounted(() => {
  if (subscription) subscription.unsubscribe();
});
</script>
<style scoped lang="scss">
.history-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0 auto 0 auto;
  width: 60rem;

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
}
</style>
