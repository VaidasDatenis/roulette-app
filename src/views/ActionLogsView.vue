<template>
  <p>Action logs</p>
  <textarea
    ref="logTextarea"
    v-model="logText"
    class="actions-text-area"
    cols="70"
    readonly
  ></textarea>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { LogActionEntry } from "@/interfaces/interfaces";
import { store } from "@/store";
import { Subscription } from "rxjs";
import { getActionLogs } from "@/store/selectors";

const logs = ref<LogActionEntry[]>([]);
const logTextarea = ref<HTMLTextAreaElement | null>(null);
let subscription: Subscription;

const logText = computed(() => {
  return logs.value
    .map((log) => `${log.timestamp.toLocaleString()} - ${log.message}`)
    .join("\n");
});

onMounted(() => {
  subscription = store.subscribe((state) => {
    logs.value = getActionLogs(state) ?? [];
  });
});

onUnmounted(() => {
  if (subscription) subscription.unsubscribe();
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
  { immediate: true },
);
</script>
<style scoped land="scss">
.actions-text-area {
  resize: none;
  background-color: #f5f5f5;
}
</style>
