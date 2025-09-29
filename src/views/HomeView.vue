<script setup lang="ts">
import { computed, reactive, watch, ref, onMounted } from 'vue';
// state
import { useQRCodeStore } from '@/stores/qrCodeStore';

// utils
import { isNilOrEmpty, checkImage } from '@/utils/';

// constants
import { LABELS, ENCRYPTION_TYPES, QR_CODE_API } from '@/constants/';

const qrCodeStore = useQRCodeStore();

const formInputsRefs = reactive({
  ssid: qrCodeStore.formInputsRefs.ssid,
  password: qrCodeStore.formInputsRefs.password,
  authenticationType: qrCodeStore.formInputsRefs.authenticationType,
});

const wifi = computed(() => {
  const hidden = false;
  return !isNilOrEmpty(formInputsRefs.ssid) && !isNilOrEmpty(formInputsRefs.password)
    ? encodeURIComponent(
        `WIFI:T:${formInputsRefs.authenticationType};S:${formInputsRefs.ssid};P:${formInputsRefs.password};H:${hidden};;`,
      )
    : '';
});

const imgSrc = ref<string>('');
const qrCodeImgRef = ref<HTMLImageElement | null>(null);
const loading = ref<boolean>(false);
const qrCodeImgSrc = async () => {
  if (!isNilOrEmpty(wifi.value)) {
    loading.value = true;
    imgSrc.value = '';
    const img = await checkImage(`${QR_CODE_API}${wifi.value}`);
    if (!isNilOrEmpty(img) && img?.hasAttribute('src')) {
      imgSrc.value = img.src;
      loading.value = false;
    }
  } else {
    imgSrc.value = '';
  }
};

watch(wifi, (newWifi) => {
  qrCodeStore.setQrCodeImgSrc(newWifi);
});

watch(
  () => formInputsRefs,
  (newRefs) => {
    qrCodeImgSrc();
    qrCodeStore.setFormInputs(newRefs);
  },
  { deep: true },
);

watch(qrCodeImgRef, (newRef) => {
  if (!isNilOrEmpty(newRef) && !isNilOrEmpty(imgSrc.value)) {
    setTimeout(() => {
      newRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1000);
  }
});

onMounted(() => {
  qrCodeImgSrc();
});
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="title">{{ LABELS.TITLE }}</div>
      <p class="description">
        {{ LABELS.DESCRIPTION }}
      </p>
    </div>
    <div class="body">
      <div class="qr-code flex flex-col items-center" v-if="!isNilOrEmpty(imgSrc) && !loading">
        <img
          :src="imgSrc"
          :alt="LABELS.QR_CODE"
          loading="lazy"
          class="qr-code-img"
          ref="qrCodeImgRef"
        />
        <div class="qr-code-label mt-4 text-center">{{ LABELS.QR_CODE_IMG_LABEL }}</div>
      </div>
      <div
        v-else-if="loading"
        class="qr-code loading w-[200px] h-[200px] flex items-center justify-center"
      >
        <p>{{ LABELS.LOADING }}</p>
      </div>
      <div class="form">
        <div class="form-group">
          <label for="ssid">{{ LABELS.SSID }}:</label>
          <input
            type="text"
            id="ssid"
            :placeholder="LABELS.PLACEHOLDER_SSID"
            v-model="formInputsRefs.ssid"
          />
        </div>
        <div class="form-group">
          <label for="password">{{ LABELS.PASSWORD }}:</label>
          <input
            type="password"
            id="password"
            :placeholder="LABELS.PLACEHOLDER_PASSWORD"
            v-model="formInputsRefs.password"
          />
        </div>
        <div class="form-group">
          <label for="encryption">{{ LABELS.AUTHENTICATION_TYPE }}:</label>
          <select id="encryption" v-model="formInputsRefs.authenticationType">
            <option
              :value="encryption"
              v-for="(encryption, encryptionIndex) in ENCRYPTION_TYPES"
              :key="`encryption-${encryptionIndex}`"
            >
              {{ encryption }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="footer">
      <button :disabled="isNilOrEmpty(imgSrc)" @click="qrCodeStore.downloadQRCode(imgSrc)">
        {{ LABELS.DOWNLOAD_BUTTON }}
      </button>
      <div class="footer-text">{{ LABELS.FOOTER_TEXT }}</div>
    </div>
  </div>
</template>
