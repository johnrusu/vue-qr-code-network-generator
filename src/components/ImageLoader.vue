<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

// ramda
import { is, pathOr } from 'ramda';

// utils
import { isNilOrEmpty, loadAsyncImage } from '@/utils/';

// constants
import { LABELS } from '@/constants/index';

// props
const props = defineProps<{
  src: string;
}>();

const loadedAsyncImage = ref<HTMLImageElement | null>(null);

const loadImage = (src: string = '') => {
  if (!isNilOrEmpty(src) && is(String, src)) {
    loadAsyncImage(src)
      .then((loadedImage: HTMLImageElement | null) => {
        if (loadedImage instanceof HTMLImageElement && !isNilOrEmpty(loadedImage)) {
          console.log(loadedImage);
          loadedAsyncImage.value = loadedImage;
        } else {
          loadedAsyncImage.value = null;
        }
      })
      .catch((error) => {
        console.error('Failed to load image:', error.message);
        loadedAsyncImage.value = null;
      });
  }
};

const LOAD_IMAGE_CONDITION =
  !isNilOrEmpty(loadedAsyncImage.value) && loadedAsyncImage.value instanceof HTMLImageElement;

watch(
  () => props.src,
  (newSrc) => {
    loadImage(newSrc);
  },
);

onMounted(() => {
  const src = pathOr('', ['src'], props);
  loadImage(src);
});
</script>

<template>
  <img
    :src="loadedAsyncImage?.src"
    :alt="LABELS.QR_CODE_IMAGE_ALT_TEXT"
    v-if="LOAD_IMAGE_CONDITION"
  />
  <div v-else>{{ LABELS.NO_IMAGE_AVAILABLE }}</div>
</template>
