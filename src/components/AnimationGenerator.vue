<script setup lang="ts">
import { onMounted, ref, reactive, computed, watchEffect } from 'vue';
import { pathOr } from 'ramda';
import { LottieAnimation } from 'lottie-web-vue';

// utils
import { isNilOrEmpty, validateJson } from '@/utils';

// constants
import { LABELS } from '@/constants';

const props = defineProps<{
  jsonData: object | string;
}>();

// refs
const animationRefData = ref<Record<string, unknown> | null>(null);
const errors = reactive<{ [key: string]: { status: boolean; message: string } }>({
  invalidJSON: {
    status: false,
    message: LABELS.INVALID_JSON,
  },
  missingData: {
    status: false,
    message: LABELS.MISSING_DATA,
  },
});

const errorMessage = computed(() =>
  errors.invalidJSON.status
    ? errors.invalidJSON.message
    : errors.missingData.status
      ? errors.missingData.message
      : '',
);

const setAnimationRefData = (): void => {
  if (!isNilOrEmpty(props)) {
    const jsonData = pathOr('', ['jsonData'], props);
    if (!isNilOrEmpty(jsonData)) {
      errors.missingData.status = false;
      const isJson = validateJson(jsonData);
      if (isNilOrEmpty(isJson) || isJson === false) {
        errors.invalidJSON.status = true;
        errors.missingData.status = false;
        animationRefData.value = null;
        return;
      }
      errors.invalidJSON.status = false;
      errors.missingData.status = false;
      animationRefData.value = isJson as Record<string, unknown>;
      return;
    }
    errors.missingData.status = true;
    errors.invalidJSON.status = false;
    animationRefData.value = null;
  }
};

watchEffect(() => {
  setAnimationRefData();
});

onMounted(() => {
  setAnimationRefData();
});
</script>

<template>
  <div v-if="!isNilOrEmpty(errorMessage)">{{ errorMessage }}</div>
  <div
    class="loading-container"
    v-if="!isNilOrEmpty(animationRefData) && animationRefData !== null"
  >
    <LottieAnimation
      :animation-data="animationRefData"
      :auto-play="true"
      :loop="true"
      :speed="1"
      ref="anim"
    />
  </div>
</template>
