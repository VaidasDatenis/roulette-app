<template>
  <input disabled class="game-input" type="text" :value="props.eventMessage" />
</template>
<script setup lang="ts">
const props = defineProps({
  eventMessage: String,
});
</script>
<style scoped lang="scss">
.game-input {
  margin: 0;
}
</style>
