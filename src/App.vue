<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

// utils
import { isNilOrEmpty } from '@/utils/';

// state
import { useQRCodeStore } from '@/stores/qrCodeStore';

// constants
import { ROUTER_LINKS } from '@/constants';

const qrCodeStore = useQRCodeStore();

const links = computed(() => {
  const { qrcodeImgSrc = '' } = qrCodeStore;
  const validLinks: Array<{ path: string; name: string }> = [];
  ROUTER_LINKS.forEach((link) => {
    if (!isNilOrEmpty(link) && !isNilOrEmpty(link.name) && !isNilOrEmpty(link.path)) {
      if (isNilOrEmpty(qrcodeImgSrc)) {
        if (link.name !== 'Home') return;
        validLinks.push(link);
      } else {
        validLinks.push(link);
      }
    }
  });
  return validLinks;
});

const computedValidLinks = computed(() => links.value);
</script>

<template>
  <nav v-if="!isNilOrEmpty(qrCodeStore?.qrcodeImgSrc)" class="nav">
    <RouterLink v-for="link in computedValidLinks" :key="link.path" :to="link.path">{{
      link.name
    }}</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
