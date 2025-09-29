import { describe, test, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

// Component under test
import App from '../src/App.vue';

// Store and utilities
import { useQRCodeStore } from '../src/stores/qrCodeStore';

// Constants
import { ROUTER_LINKS } from '../src/constants';

// Mock router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/print', component: { template: '<div>Print</div>' } },
  ],
});

describe('App.vue', () => {
  let wrapper: VueWrapper;
  let pinia: ReturnType<typeof createPinia>;
  let qrCodeStore: ReturnType<typeof useQRCodeStore>;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);
    qrCodeStore = useQRCodeStore();

    wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
            props: ['to'],
          },
          RouterView: {
            template: '<div>Router View Content</div>',
          },
        },
      },
    });

    await router.isReady();
  });

  test('should mount component successfully', () => {
    expect(App).toBeTruthy();
    expect(wrapper.exists()).toBe(true);
  });

  test('should render RouterView in main element', () => {
    const main = wrapper.find('main');
    expect(main.exists()).toBe(true);
    expect(main.text()).toContain('Router View Content');
  });

  test('should not show navigation when qrCodeImgSrc is empty', async () => {
    // Ensure qrCodeImgSrc is empty/null
    qrCodeStore.setQrCodeImgSrc('');
    await wrapper.vm.$nextTick();

    const nav = wrapper.find('nav');
    expect(nav.exists()).toBe(false);
  });

  test('should show navigation when qrCodeImgSrc has value', async () => {
    // Set qrCodeImgSrc to have a value
    qrCodeStore.setQrCodeImgSrc('data:image/png;base64,test');
    await wrapper.vm.$nextTick();

    const nav = wrapper.find('nav');
    expect(nav.exists()).toBe(true);
    expect(nav.classes()).toContain('nav');
  });

  test('should render correct navigation links when QR code exists', async () => {
    qrCodeStore.setQrCodeImgSrc('data:image/png;base64,test');
    await wrapper.vm.$nextTick();

    const navLinks = wrapper.findAll('a');

    // Should render all router links when QR code exists
    expect(navLinks).toHaveLength(ROUTER_LINKS.length);

    // Check if Home link exists
    const homeLink = navLinks.find((link) => link.text().includes('Home'));
    expect(homeLink?.exists()).toBe(true);

    // Check if Print link exists
    const printLink = navLinks.find((link) => link.text().includes('Print Qr Code'));
    expect(printLink?.exists()).toBe(true);
  });

  test('should render navigation links with correct structure', async () => {
    qrCodeStore.setQrCodeImgSrc('data:image/png;base64,test');
    await wrapper.vm.$nextTick();

    const navLinks = wrapper.findAll('a');

    navLinks.forEach((link, index) => {
      const expectedLink = ROUTER_LINKS[index];

      // Check that the link contains the expected text
      expect(link.text().trim()).toBe(expectedLink.name);

      // Check for icon span (though we're not testing the actual icon classes in this basic test)
      const iconSpan = link.find('.icon');
      expect(iconSpan.exists()).toBe(true);
    });
  });

  test('should update navigation visibility reactively when qrCodeImgSrc changes', async () => {
    // Initially no QR code
    qrCodeStore.setQrCodeImgSrc('');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('nav').exists()).toBe(false);

    // Add QR code
    qrCodeStore.setQrCodeImgSrc('data:image/png;base64,test');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('nav').exists()).toBe(true);

    // Remove QR code again
    qrCodeStore.setQrCodeImgSrc('');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('nav').exists()).toBe(false);
  });

  test('should have proper navigation structure with nav-links class', async () => {
    qrCodeStore.setQrCodeImgSrc('data:image/png;base64,test');
    await wrapper.vm.$nextTick();

    const nav = wrapper.find('nav');
    const navLinksDiv = nav.find('.nav-links');

    expect(navLinksDiv.exists()).toBe(true);
    expect(navLinksDiv.findAll('a')).toHaveLength(ROUTER_LINKS.length);
  });

  test('should properly compute valid links based on store state', async () => {
    // Test with no QR code - should only show Home
    qrCodeStore.setQrCodeImgSrc('');
    await wrapper.vm.$nextTick();

    // Since nav is hidden when no QR code, we test the computed property indirectly
    // by checking that navigation doesn't exist
    expect(wrapper.find('nav').exists()).toBe(false);

    // Test with QR code - should show all links
    qrCodeStore.setQrCodeImgSrc('data:image/png;base64,test');
    await wrapper.vm.$nextTick();

    const navLinks = wrapper.findAll('a');
    expect(navLinks).toHaveLength(ROUTER_LINKS.length);
  });
});
