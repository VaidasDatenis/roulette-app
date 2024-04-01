<template>
  <p>Action logs</p>
  <ActionLogs />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ActionLogs from "@/components/ActionLogs.vue";

@Options({
  components: {
    ActionLogs,
  },
})
export default class ActionLogsView extends Vue {}
</script>
