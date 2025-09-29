<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
// state
import { useQRCodeStore } from '@/stores/qrCodeStore';

// utils
import { isNilOrEmpty } from '@/utils/';

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
const qrCodeImgSrc = computed(() =>
  !isNilOrEmpty(wifi.value) ? `${QR_CODE_API}${wifi.value}` : '',
);

watch(wifi, (newWifi) => {
  qrCodeStore.setQrCodeImgSrc(newWifi);
});

watch(
  () => formInputsRefs,
  (newRefs) => {
    qrCodeStore.setFormInputs(newRefs);
  },
  { deep: true },
);
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
      <div class="qr-code" v-if="qrCodeImgSrc">
        <img :src="qrCodeImgSrc" :alt="LABELS.QR_CODE" loading="lazy" />
        <div class="qr-code-label mt-4">{{ LABELS.QR_CODE_IMG_LABEL }}</div>
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
      <button
        :disabled="isNilOrEmpty(qrCodeImgSrc)"
        @click="qrCodeStore.downloadQRCode(qrCodeImgSrc)"
      >
        {{ LABELS.DOWNLOAD_BUTTON }}
      </button>
      <div class="footer-text">{{ LABELS.FOOTER_TEXT }}</div>
    </div>
  </div>
</template>
