<script setup lang="ts">
import { computed, reactive, watch, ref, onMounted, type Ref } from 'vue';
// state
import { useQRCodeStore } from '@/stores/qrCodeStore';

// utils
import { isNilOrEmpty, loadAsyncImage } from '@/utils/';

// constants
import { LABELS, ENCRYPTION_TYPES, QR_CODE_API, TIMEOUT_DURATION } from '@/constants/';

// components
import AnimationGenerator from '@/components/AnimationGenerator.vue';

// state
const qrCodeStore = useQRCodeStore();

// json animations
import loadingAnimation from '@/assets/animations/loading.json';

const baseUrl = import.meta.env.BASE_URL;

const formInputsRefs = reactive({
  ssid: qrCodeStore.formInputsRefs.ssid,
  password: qrCodeStore.formInputsRefs.password,
  authenticationType: qrCodeStore.formInputsRefs.authenticationType,
});

const wifi = computed(() => {
  const hidden = false;
  return !isNilOrEmpty(formInputsRefs.ssid) &&
    !isNilOrEmpty(formInputsRefs.password) &&
    !isNilOrEmpty(formInputsRefs.authenticationType)
    ? encodeURIComponent(
        `WIFI:T:${formInputsRefs.authenticationType};S:${formInputsRefs.ssid};P:${formInputsRefs.password};H:${hidden};;`,
      )
    : '';
});

const imgSrc = ref<string>('');
const qrCodeImgRef = ref<HTMLImageElement | null>(null);
const loading = ref<boolean>(false);

const ssidInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);
const authenticationTypeInput = ref<HTMLInputElement | null>(null);

const inputRefs = reactive<{ [key: string]: Ref<HTMLInputElement | null> }>({
  ssid: ssidInput,
  password: passwordInput,
  authenticationType: authenticationTypeInput,
});

const checkInputs = () => {
  for (const inputRef in formInputsRefs) {
    const id = inputRef;
    const hasValue = !isNilOrEmpty(formInputsRefs[id as keyof typeof formInputsRefs]);
    const element: HTMLInputElement = inputRefs[id] as unknown as HTMLInputElement;
    if (!hasValue) {
      resetAll();
      if (!isNilOrEmpty(element)) {
        element.classList.add('input-error');
      }
    } else {
      element.classList.remove('input-error');
    }
  }

  if (isNilOrEmpty(formInputsRefs.ssid) && !isNilOrEmpty(ssidInput.value)) {
    ssidInput.value?.classList.add('input-error');
    ssidInput.value?.focus();
  }
};

const resetAll = () => {
  imgSrc.value = '';
};

const qrCodeImgSrc = async (checkInputsStatus = false) => {
  if (checkInputsStatus) {
    checkInputs();
  }
  if (!isNilOrEmpty(wifi.value)) {
    loading.value = true;
    resetAll();
    const img = await loadAsyncImage(`${QR_CODE_API}${wifi.value}`);
    if (!isNilOrEmpty(img) && img?.hasAttribute('src')) {
      setTimeout(
        () => {
          loading.value = false;
          imgSrc.value = img.src;
          qrCodeStore.setFormInputs({ ...formInputsRefs, generated: true });
        },
        !checkInputsStatus ? 0 : TIMEOUT_DURATION,
      );
    }
  } else {
    resetAll();
  }
};

watch(wifi, (newWifi) => {
  qrCodeStore.setQrCodeImgSrc(newWifi);
});

watch(
  () => formInputsRefs,
  (newRefs) => {
    qrCodeStore.setFormInputs({
      ...newRefs,
      generated: Object.entries(formInputsRefs).some((entry) => isNilOrEmpty(entry[1]))
        ? false
        : qrCodeStore.formInputsRefs.generated,
    });
    checkInputs();
  },
  { deep: true },
);

watch(qrCodeImgRef, (newRef) => {
  if (!isNilOrEmpty(newRef) && !isNilOrEmpty(imgSrc.value)) {
    setTimeout(() => {
      newRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, TIMEOUT_DURATION);
  }
});

const isButtonDisabled = computed(() => {
  return Object.entries(formInputsRefs).some((entry) => isNilOrEmpty(entry[1]));
});

const shareUrl = computed(() => {
  return `/share?ssid=${encodeURIComponent(formInputsRefs.ssid)}&password=${encodeURIComponent(formInputsRefs.password)}&authenticationType=${encodeURIComponent(formInputsRefs.authenticationType)}`;
});

onMounted(() => {
  qrCodeImgSrc(false);
});
</script>

<template>
  <div class="container">
    <div class="header flex flex-row items-center justify-start pb-5 mt-5 gap-4 w-full">
      <div class="logo">
        <img :src="`${baseUrl}favicons/apple-icon-72x72.png`" alt="Logo" />
      </div>
      <div class="flex items-start flex-col justify-center">
        <div class="title">{{ LABELS.TITLE }}</div>
        <div>
          {{ LABELS.DESCRIPTION }}
        </div>
      </div>
    </div>
    <div class="body">
      <div
        class="qr-code flex flex-col items-center min-h-70"
        v-if="!isNilOrEmpty(imgSrc) && !loading"
      >
        <img
          :src="imgSrc"
          :alt="LABELS.QR_CODE"
          loading="lazy"
          class="qr-code-img"
          ref="qrCodeImgRef"
        />
        <div class="qr-code-label mt-4 text-center">{{ LABELS.QR_CODE_IMG_LABEL }}</div>
        <div class="download-link mt-2">
          <router-link to="/print" class="download-qr-code-btn underline">
            {{ LABELS.DOWNLOAD_BUTTON }}
          </router-link>
          <router-link :to="shareUrl" class="download-qr-code-btn underline ml-4">
            {{ LABELS.SHARE_BUTTON }}
          </router-link>
        </div>
      </div>
      <div
        v-else-if="loading"
        class="qr-code loading w-50 min-h-70 flex items-center justify-center"
      >
        <p><AnimationGenerator :jsonData="loadingAnimation" /></p>
      </div>
      <div class="form">
        <div class="form-group">
          <label for="ssid">{{ LABELS.SSID }}:</label>
          <input
            type="text"
            id="ssid"
            :placeholder="LABELS.PLACEHOLDER_SSID"
            v-model="formInputsRefs.ssid"
            autocomplete="false"
            autofocus
            ref="ssidInput"
          />
        </div>
        <div class="form-group">
          <label for="password">{{ LABELS.PASSWORD }}:</label>
          <input
            type="password"
            id="password"
            :placeholder="LABELS.PLACEHOLDER_PASSWORD"
            v-model="formInputsRefs.password"
            autocomplete="false"
            ref="passwordInput"
          />
        </div>
        <div class="form-group">
          <label for="encryption">{{ LABELS.AUTHENTICATION_TYPE }}:</label>
          <select
            id="encryption"
            v-model="formInputsRefs.authenticationType"
            ref="authenticationTypeInput"
          >
            <option
              :value="encryption"
              v-for="(encryption, encryptionIndex) in ENCRYPTION_TYPES"
              :key="`encryption-${encryptionIndex}`"
            >
              {{ encryption }}
            </option>
          </select>
        </div>
        <div class="flex flex-col items-center pt-2">
          <button
            :disabled="isButtonDisabled"
            type="button"
            class="generate-qr-code-btn p-2 w-full cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="() => (isButtonDisabled ? null : qrCodeImgSrc(true))"
          >
            {{ LABELS.GENERATE_BUTTON }}
          </button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-text" v-html="LABELS.FOOTER_TEXT()"></div>
    </div>
  </div>
</template>
