<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// constants
import { TIMEOUT_DURATION } from '@/constants/';

// utils
import { isNilOrEmpty, loadAsyncImage } from '@/utils/';

// constants
import { LABELS, QR_CODE_API } from '@/constants';

// router
const route = useRoute();
const router = useRouter();

// Get values from URL params
const imgSrc = ref<string>('');
const ssid = ref<string>((route.query.ssid as string) || '');
const password = ref<string>((route.query.password as string) || '');
const authenticationType = ref<string>((route.query.authenticationType as string) || '');

// Generate QR code image URL
const wifi = computed(() => {
  const hidden = false;
  return !isNilOrEmpty(ssid.value) &&
    !isNilOrEmpty(password.value) &&
    !isNilOrEmpty(authenticationType.value)
    ? encodeURIComponent(
        `WIFI:T:${authenticationType.value};S:${ssid.value};P:${password.value};H:${hidden};;`,
      )
    : '';
});

const qrCodeImgSrc = async (checkInputsStatus = false) => {
  if (!isNilOrEmpty(wifi.value)) {
    console.log(wifi.value);
    const img = await loadAsyncImage(`${QR_CODE_API}${wifi.value}`);
    if (!isNilOrEmpty(img) && img?.hasAttribute('src')) {
      setTimeout(
        () => {
          imgSrc.value = img.src;
        },
        !checkInputsStatus ? 0 : TIMEOUT_DURATION,
      );
    }
  }
};

// Load QR code image on component mount
onMounted(async () => {
  // Redirect to home if no QR code data
  if (
    isNilOrEmpty(ssid.value) ||
    isNilOrEmpty(password.value) ||
    isNilOrEmpty(authenticationType.value)
  ) {
    router.push({ name: 'home' });
    return;
  }
  
  await qrCodeImgSrc();
});
</script>
<template>
  <div class="print w-full flex flex-col items-center" v-if="!isNilOrEmpty(imgSrc)">
    <img :src="imgSrc" :alt="LABELS.QR_CODE" loading="lazy" class="qr-code-img" />
    <div class="qr-code-label mt-4">{{ LABELS.QR_CODE_IMG_LABEL }}</div>
  </div>
</template>
