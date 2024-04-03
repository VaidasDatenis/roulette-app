<template>
  <input disabled class="game-input" type="text" :value="$props.eventMessage" />
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: { eventMessage: String },
  setup(props) {
    return { ...props };
  },
});
</script>
<style lang="scss">
.game-input {
  margin: 0;
}
</style>
