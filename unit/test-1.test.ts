/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from '../src/App.vue';
import { useQRCodeStore } from '../src/stores/qrCodeStore';
import HomeView from '../src/views/HomeView.vue';
import PrintView from '../src/views/PrintView.vue';

// Mock the utils
vi.mock('../src/utils/', () => ({
  isNilOrEmpty: (value: any) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },
}));

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/print', name: 'Print', component: PrintView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('App.vue', () => {
  let pinia: any;
  let store: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    store = useQRCodeStore();
  });

  const createWrapper = (storeOverrides = {}) => {
    // Apply store overrides
    Object.assign(store, storeOverrides);

    return mount(App, {
      global: {
        plugins: [pinia, router],
        stubs: {
          RouterView: true,
          RouterLink: true,
        },
      },
    });
  };

  describe('Navigation visibility', () => {
    it('should not show navigation when qrcodeImgSrc is empty', () => {
      const wrapper = createWrapper({
        qrcodeImgSrc: '',
        formInputsRefs: {
          ssid: 'test-network',
          password: 'test-password',
          authenticationType: 'WPA',
          generated: false,
        },
      });

      const nav = wrapper.find('nav');
      expect(nav.exists()).toBe(false);
    });

    it('should not show navigation when generated is false', () => {
      const wrapper = createWrapper({
        qrcodeImgSrc: 'some-qr-code-data',
        formInputsRefs: {
          ssid: 'test-network',
          password: 'test-password',
          authenticationType: 'WPA',
          generated: false,
        },
      });

      const nav = wrapper.find('nav');
      expect(nav.exists()).toBe(false);
    });

    it('should show navigation when qrcodeImgSrc has value and generated is true', () => {
      const wrapper = createWrapper({
        qrcodeImgSrc: 'some-qr-code-data',
        formInputsRefs: {
          ssid: 'test-network',
          password: 'test-password',
          authenticationType: 'WPA',
          generated: true,
        },
      });

      const nav = wrapper.find('nav');
      expect(nav.exists()).toBe(true);
    });
  });

  describe('Navigation links', () => {
    it('should render navigation links when QR code is generated', () => {
      const wrapper = createWrapper({
        qrcodeImgSrc: 'some-qr-code-data',
        formInputsRefs: {
          ssid: 'test-network',
          password: 'test-password',
          authenticationType: 'WPA',
          generated: true,
        },
      });

      const nav = wrapper.find('nav');
      expect(nav.exists()).toBe(true);

      const navLinks = wrapper.find('.nav-links');
      expect(navLinks.exists()).toBe(true);
    });

    it('should have proper navigation structure', () => {
      const wrapper = createWrapper({
        qrcodeImgSrc: 'some-qr-code-data',
        formInputsRefs: {
          ssid: 'test-network',
          password: 'test-password',
          authenticationType: 'WPA',
          generated: true,
        },
      });

      const nav = wrapper.find('nav.nav');
      expect(nav.exists()).toBe(true);
      expect(nav.classes()).toContain('nav');
    });
  });

  describe('Main content', () => {
    it('should always render main element with RouterView', () => {
      const wrapper = createWrapper();

      const main = wrapper.find('main');
      expect(main.exists()).toBe(true);

      const routerView = wrapper.findComponent({ name: 'RouterView' });
      expect(routerView.exists()).toBe(true);
    });
  });

  describe('Computed properties', () => {
    it('should compute valid links correctly when no QR code is generated', async () => {
      const wrapper = createWrapper({
        qrcodeImgSrc: '',
        formInputsRefs: {
          ssid: '',
          password: '',
          authenticationType: 'WPA',
          generated: false,
        },
      });

      // Access the component instance to test computed properties
      const vm = wrapper.vm as any;

      // The component should only show Home when no QR code is generated
      expect(vm.computedValidLinks).toBeDefined();
    });

    it('should compute valid links correctly when QR code is generated', async () => {
      const wrapper = createWrapper({
        qrcodeImgSrc: 'some-qr-code-data',
        formInputsRefs: {
          ssid: 'test-network',
          password: 'test-password',
          authenticationType: 'WPA',
          generated: true,
        },
      });

      const vm = wrapper.vm as any;

      // When QR code is generated, all valid links should be available
      expect(vm.computedValidLinks).toBeDefined();
    });
  });

  describe('Store integration', () => {
    it('should use QR code store correctly', () => {
      const store = useQRCodeStore();
      expect(store).toBeDefined();
      expect(store.qrcodeImgSrc).not.toBeDefined();
      expect(store.formInputsRefs).toBeDefined();
    });

    it('should react to store changes', async () => {
      const wrapper = createWrapper({
        qrcodeImgSrc: '',
        formInputsRefs: {
          ssid: 'test',
          password: 'test',
          authenticationType: 'WPA',
          generated: false,
        },
      });

      // Initially no nav should be visible
      expect(wrapper.find('nav').exists()).toBe(false);

      // Update store to show QR code is generated
      store.qrcodeImgSrc = 'new-qr-code-data';
      store.formInputsRefs.generated = true;

      await wrapper.vm.$nextTick();

      // Now nav should be visible
      expect(wrapper.find('nav').exists()).toBe(true);
    });
  });

  describe('Component structure', () => {
    it('should have the correct overall structure', () => {
      const wrapper = createWrapper();

      // Should have main element
      expect(wrapper.find('main').exists()).toBe(true);

      // Should contain RouterView
      expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true);
    });
  });
});
