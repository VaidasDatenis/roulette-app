<template>
  <span>History table</span>
  <div class="history-container">
    <HistoryTable />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HistoryTable from "@/components/HistoryTable.vue";

@Options({
  components: {
    HistoryTable,
  },
})
export default class HistoryView extends Vue {}
</script>
<style lang="scss">
.history-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0 auto 0 auto;
  width: 60rem;
}
</style>
