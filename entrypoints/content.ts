import { createApp } from 'vue'
import App from './Contents.vue'
import './style.css'

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'words-100-helper',
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount: (container) => {
        // Create the app and mount it to the UI container
        container.id = 'bcz-lgelpdnoogahffdkigeeonhggglogabb'
        const app = createApp(App)
        app.mount(container)
        return app
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app?.unmount()
      },
    })

    // Call mount to add the UI to the DOM
    ui.mount()
  },
})
