<template>
  <div class="board-view">
    <div class="board-container">
      <RouletteBoard />
      <EventLog />
    </div>
    <div class="logs-view-container">
      <button class="router-component-btn" @click="toggleLogView">
        Toggle Log View
      </button>
      <router-view />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import RouletteBoard from "@/components/RouletteBoard.vue";
import EventLog from "@/components/EventLog.vue";

const route = useRoute();
const router = useRouter();

function toggleLogView() {
  route.path.includes("/home/logs")
    ? router.push("/home")
    : router.push("/home/logs");
}
</script>
<style scoped lang="scss">
.board-view {
  display: flex;

  .board-container {
    width: 61.25rem;
    border-right: 1px solid rgb(190, 189, 189);
    margin-right: 20px;
  }

  .logs-view-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .router-component-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 50px;
    border: 1px solid grey;
    border-radius: 5px;
  }
}
</style>
