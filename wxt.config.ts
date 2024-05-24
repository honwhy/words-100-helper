import { defineConfig } from 'wxt'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: () => ({
    name: '新百词斩助手',
    permissions: ['storage'],
    host_permissions: [
      'http://110.42.229.221/*',
      'https://resource.baicizhan.com/*',
      'https://words-100-api.honwhy-wang.workers.dev/*',
    ],
    web_accessible_resources: [
      {
        resources: ['*.png', '*.svg', '*.txt', 'options.html'],
        matches: ['<all_urls>'],
      },
    ],
  }),
  imports: {
    addons: {
      vueTemplate: true,
    },
  },
  vite: () => ({
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    build: {
      // Enabling sourcemaps with Vue during development is known to cause problems with Vue
      sourcemap: false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/global.scss';`,
        },
      },
    },
  }),
  zip: {
    excludeSources: ['env.txt'],
  },
})
