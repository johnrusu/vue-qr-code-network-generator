<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// utils
import { isNilOrEmpty } from '@/utils/';

// state
import { useQRCodeStore } from '@/stores/qrCodeStore';

// constants
import { LABELS, QR_CODE_API } from '@/constants';

// store
const qrCodeStore = useQRCodeStore();
const router = useRouter();

const qrCodeImgSrc = computed(() =>
  !isNilOrEmpty(qrCodeStore.qrcodeImgSrc) ? `${QR_CODE_API}${qrCodeStore.qrcodeImgSrc}` : '',
);

if (isNilOrEmpty(qrCodeStore.qrcodeImgSrc)) {
  router.push({ name: 'home' });
}
</script>
<template>
  <div class="print w-full flex flex-col items-center" v-if="!isNilOrEmpty(qrCodeImgSrc)">
    <img :src="qrCodeImgSrc" :alt="LABELS.QR_CODE" loading="lazy" class="qr-code-img" />
    <div class="qr-code-label mt-4">{{ LABELS.QR_CODE_IMG_LABEL }}</div>
  </div>
</template>
