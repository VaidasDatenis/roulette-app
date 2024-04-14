<template>
  <button
    :class="[
      'roulette-number',
      {
        'highlight-button': isWinning,
        'selected-button': isSelected,
        'flash-gold': isResultMatch,
      },
    ]"
    :style="{
      backgroundColor: color,
    }"
    @click="$emit('select', props.number)"
  >
    {{ number }}
  </button>
</template>
<script setup lang="ts">
const props = defineProps({
  number: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  isWinning: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isResultMatch: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss">
@keyframes highlight-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes flash-gold {
  0%,
  100% {
    background-color: color;
  }
  50% {
    background-color: gold;
  }
}

.roulette-number {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
  font-weight: bold;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.5s ease-in-out;

  &.highlight-button {
    animation: highlight-animation 3s ease-in-out;
  }

  &.selected-button {
    border: 2px solid greenyellow;
  }

  &.flash-gold {
    animation: flash-gold 3s ease-in-out;
  }
}
</style>
