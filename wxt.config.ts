import { defineConfig } from 'wxt'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: ({ browser }) => ({
    permissions: browser === 'firefox' ? ['storage', 'http://110.42.229.221/*'] : ['storage'],
    host_permissions: [
      'http://110.42.229.221/*',
    ],
    web_accessible_resources: [
      {
        resources: ['*.png', '*.svg', '*.txt'],
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
