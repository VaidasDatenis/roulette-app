<template>
  <textarea ref="logTextarea" v-model="logText" cols="70" readonly></textarea>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { LogActionEntry } from "@/interfaces/interfaces";
import { state$ } from "@/store";
export default defineComponent({
  setup() {
    const logs = ref<LogActionEntry[]>([]);
    const logTextarea = ref<HTMLTextAreaElement | null>(null);
    onMounted(() => {
      const subscription = state$.subscribe((state) => {
        if (state.actionLogs) {
          logs.value = state.actionLogs;
        }
      });

      onUnmounted(() => {
        subscription.unsubscribe();
      });
    });
    const logText = computed(() => {
      return logs.value
        .map((log) => `${log.timestamp.toLocaleString()} - ${log.message}`)
        .join("\n");
    });
    watch(
      logText,
      async () => {
        await nextTick();
        if (logTextarea.value) {
          logTextarea.value.style.height = "auto";
          logTextarea.value.style.height = `${logTextarea.value.scrollHeight}px`;
        }
      },
      { immediate: true }
    );
    return {
      logText,
      logTextarea,
    };
  },
});
</script>
<style lang="scss">
textarea {
  resize: none;
  background-color: #f5f5f5;
}
</style>
