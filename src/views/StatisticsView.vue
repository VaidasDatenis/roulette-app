<template>
  <div class="statistics-container">
    <StatisticsTable />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import StatisticsTable from "@/components/StatisticsTable.vue";

@Options({
  components: {
    StatisticsTable,
  },
})
export default class StatisticsView extends Vue {}
</script>
<style scoped lang="scss">
.statistics-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 10%;
}
</style>
