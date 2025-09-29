import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import { ENCRYPTION_TYPES } from '@/constants';

export const useQRCodeStore = defineStore('qr-code', () => {
  const qrcodeImgSrc = ref();
  const formInputsRefs = reactive({
    ssid: ref<string>(ENCRYPTION_TYPES.wpa),
    password: ref<string>(''),
    authenticationType: ref<string>(ENCRYPTION_TYPES.wpa),
  });
  const downloadQRCode = (imgSrc: string) => {
    if (!imgSrc) return;
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = 'wifi-qr-code.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const setQrCodeImgSrc = (src: string) => {
    qrcodeImgSrc.value = src;
  };

  const setFormInputs = (inputs: Partial<typeof formInputsRefs>) => {
    Object.assign(formInputsRefs, inputs);
  };

  return { qrcodeImgSrc, downloadQRCode, setQrCodeImgSrc, formInputsRefs, setFormInputs };
});
