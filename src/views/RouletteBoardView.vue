<template>
  <div class="board-view">
    <div class="board-container">
      <RouletteBoard />
      <EventLog />
    </div>
    <button class="router-component-btn" @click="toggleLogView">
      Toggle Log View
    </button>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import RouletteBoard from "@/components/RouletteBoard.vue";
import EventLog from "@/components/EventLog.vue";

@Options({
  components: {
    RouletteBoard,
    EventLog,
  },
})
export default class RouletteBoardView extends Vue {
  toggleLogView() {
    this.$route.path.includes("/home/logs")
      ? this.$router.push("/home")
      : this.$router.push("/home/logs");
  }
}
</script>
<style scoped lang="scss">
.board-view {
  display: flex;

  .board-container {
    width: 81.25rem;
    border-right: 1px solid rgb(190, 189, 189);
    margin-right: 20px;
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
