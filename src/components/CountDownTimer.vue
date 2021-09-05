<template>
  <span>
    {{ timeRemaining }}
  </span>
</template>

<script lang="ts">
import { defineComponent, toRef, ref, watch, onMounted, PropType } from 'vue';
import { DateTime, DurationObjectUnits } from 'luxon';

export default defineComponent({
  name: 'CountDownTimer',
  props: {
    duration: { type: Object as PropType<DurationObjectUnits>, required: true },
  },
  setup(props) {
    const duration: DurationObjectUnits = toRef(props, 'duration');
    const timeRemaining = ref('');
    let intervalId = -Infinity;

    const getCurrentTime = (): string => DateTime.now().toFormat('hh:mm:ss a');

    const updateClock = () => {
      timeRemaining.value = getCurrentTime();
    };

    const startClock = () => {
      intervalId = window.setInterval(updateClock, 1000);
    };

    const stopClock = () => {
      if (intervalId > -Infinity) {
        window.clearInterval(intervalId);
      }
    };

    onMounted(updateClock);
    watch(clockRunning, (newValue: boolean) => {
      if (newValue) {
        startClock();
      } else {
        stopClock();
      }
    });

    return { currentTime: timeRemaining };
  },
});
</script>
