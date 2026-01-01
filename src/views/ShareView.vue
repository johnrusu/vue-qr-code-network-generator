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

// Share functionality
const shareUrl = computed(() => window.location.href);
const copyLinkMessage = ref<string>('');

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copyLinkMessage.value = LABELS.LINK_COPIED;
    setTimeout(() => {
      copyLinkMessage.value = '';
    }, 3000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const shareViaEmail = () => {
  const subject = encodeURIComponent(`WiFi Network: ${ssid.value}`);
  const body = encodeURIComponent(
    `Connect to WiFi network "${ssid.value}" using this QR code: ${shareUrl.value}`,
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

const shareViaWhatsApp = () => {
  const text = encodeURIComponent(
    `Connect to WiFi network "${ssid.value}" using this QR code: ${shareUrl.value}`,
  );
  window.open(`https://wa.me/?text=${text}`, '_blank');
};

const shareViaTwitter = () => {
  const text = encodeURIComponent(`Check out this WiFi QR code for network "${ssid.value}"`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl.value}`, '_blank');
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
  <div class="print w-full flex flex-col items-center p-4" v-if="!isNilOrEmpty(imgSrc)">
    <div class="mb-6">
      <h2 class="text-2xl font-bold md:text-center text-left mb-2">{{ ssid }}</h2>
      <p class="text-gray-600 md:text-center text-left">{{ LABELS.QR_CODE_IMG_LABEL }}</p>
    </div>

    <img :src="imgSrc" :alt="LABELS.QR_CODE" loading="lazy" class="qr-code-img mb-6" />

    <div class="flex flex-col gap-3 w-full max-w-md">
      <button
        @click="copyToClipboard"
        class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <i class="fas fa-link"></i>
        {{ LABELS.COPY_LINK }}
      </button>

      <p v-if="copyLinkMessage" class="text-center text-green-600 font-medium">
        {{ copyLinkMessage }}
      </p>

      <button
        @click="shareViaEmail"
        class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <i class="fas fa-envelope"></i>
        {{ LABELS.SHARE_VIA_EMAIL }}
      </button>

      <button
        @click="shareViaWhatsApp"
        class="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <i class="fab fa-whatsapp"></i>
        {{ LABELS.SHARE_VIA_WHATSAPP }}
      </button>

      <button
        @click="shareViaTwitter"
        class="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
      >
        <i class="fab fa-twitter"></i>
        {{ LABELS.SHARE_VIA_TWITTER }}
      </button>

      <router-link
        to="/"
        class="flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        <i class="fas fa-arrow-left"></i>
        Back to Home
      </router-link>
    </div>
  </div>
</template>
